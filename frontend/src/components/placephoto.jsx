import { useEffect, useState } from "react";

const imageCache = new Map();

const FALLBACK_GRADIENT =
  "linear-gradient(135deg, rgba(48,35,88,.96), rgba(15,23,42,.98))";

/**
 * Finds a relevant image on Wikimedia Commons for a destination or place.
 * Props:
 *   query       - e.g. "Burj Khalifa Dubai"
 *   alt         - accessible description
 *   asBackground - render a full-cover background layer for a hero/header
 *   height      - image-card height in pixels (default 180)
 */
export default function PlacePhoto({
  query,
  alt,
  asBackground = false,
  height = 180,
  className = "",
}) {
  const [imageUrl, setImageUrl] = useState(() => imageCache.get(query)?.url || "");
  const [descriptionUrl, setDescriptionUrl] = useState(() => imageCache.get(query)?.pageUrl || "");
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(!imageCache.has(query));

  useEffect(() => {
    let cancelled = false;
    const cleanQuery = String(query || "").trim();

    if (!cleanQuery) {
      setLoading(false);
      setImageUrl("");
      return () => { cancelled = true; };
    }

    const cached = imageCache.get(cleanQuery);
    if (cached) {
      setImageUrl(cached.url || "");
      setDescriptionUrl(cached.pageUrl || "");
      setFailed(false);
      setLoading(false);
      return () => { cancelled = true; };
    }

    try {
      const saved = sessionStorage.getItem(`tv_image_${cleanQuery.toLowerCase()}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        imageCache.set(cleanQuery, parsed);
        setImageUrl(parsed.url || "");
        setDescriptionUrl(parsed.pageUrl || "");
        setFailed(false);
        setLoading(false);
        return () => { cancelled = true; };
      }
    } catch {
      // Storage may be disabled; continue with a live request.
    }

    setLoading(true);
    setFailed(false);

    const params = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrnamespace: "6",
      gsrlimit: "8",
      gsrsearch: `filetype:bitmap ${cleanQuery}`,
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: asBackground ? "1600" : "800",
    });

    fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`)
      .then((response) => {
        if (!response.ok) throw new Error("Image search unavailable");
        return response.json();
      })
      .then((data) => {
        const pages = Object.values(data?.query?.pages || {});
        const queryWords = cleanQuery.toLowerCase().split(/[\s,]+/).filter((word) => word.length > 2);

        // Prefer image titles containing the important words from the requested place.
        const ranked = pages
          .map((page) => {
            const title = String(page.title || "").toLowerCase();
            const score = queryWords.reduce((total, word) => total + (title.includes(word) ? 1 : 0), 0);
            return { page, score };
          })
          .sort((a, b) => b.score - a.score);

        const best = ranked.find(({ page }) => {
          const info = page.imageinfo?.[0];
          return info?.thumburl || info?.url;
        })?.page;

        const info = best?.imageinfo?.[0];
        const result = {
          url: info?.thumburl || info?.url || "",
          pageUrl: info?.descriptionurl || "",
        };

        if (cancelled) return;

        imageCache.set(cleanQuery, result);
        setImageUrl(result.url);
        setDescriptionUrl(result.pageUrl);
        setFailed(false);
        setLoading(false);

        try {
          sessionStorage.setItem(`tv_image_${cleanQuery.toLowerCase()}`, JSON.stringify(result));
        } catch {
          // Image caching is optional.
        }
      })
      .catch(() => {
        if (cancelled) return;
        setImageUrl("");
        setDescriptionUrl("");
        setFailed(true);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query, asBackground]);

  if (asBackground) {
    return (
      <div
        aria-hidden="true"
        className={`place-photo-background ${className}`}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
          background: FALLBACK_GRADIENT,
        }}
      >
        {imageUrl && !failed && (
          <img
            src={imageUrl}
            alt=""
            onError={() => setFailed(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(15,12,32,.88) 0%, rgba(20,18,42,.62) 55%, rgba(20,18,42,.28) 100%), linear-gradient(0deg, rgba(10,15,30,.35), transparent)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`place-photo ${className}`}
      style={{
        width: "100%",
        height,
        minHeight: height,
        overflow: "hidden",
        position: "relative",
        display: "block",
        background: FALLBACK_GRADIENT,
        borderRadius: "12px",
      }}
    >
      {imageUrl && !failed ? (
        <img
          src={imageUrl}
          alt={alt || query || "Travel destination"}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          role="img"
          aria-label={alt || query || "Travel photo unavailable"}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "8px",
            color: "#e8eaf6",
            background: FALLBACK_GRADIENT,
            textAlign: "center",
            padding: "12px",
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontSize: "32px" }}>{loading ? "🌍" : "📸"}</span>
          <span style={{ fontSize: "12px", fontWeight: 600 }}>
            {loading ? "Finding photo…" : "Photo unavailable"}
          </span>
        </div>
      )}
      {descriptionUrl && imageUrl && !failed && (
        <a
          href={descriptionUrl}
          target="_blank"
          rel="noreferrer"
          title="View image source and licence"
          aria-label="View image source and licence"
          style={{
            position: "absolute",
            right: "7px",
            bottom: "7px",
            fontSize: "10px",
            padding: "4px 6px",
            borderRadius: "5px",
            color: "white",
            background: "rgba(0,0,0,.65)",
            textDecoration: "none",
          }}
        >
          Image source
        </a>
      )}
    </div>
  );
}
