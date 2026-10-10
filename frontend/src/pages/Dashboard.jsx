import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85";

// Destination-specific travel photographs used when a trip has no saved image.
const DESTINATION_IMAGES = {
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
  india: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
  chennai: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deABC7c2?auto=format&fit=crop&w=1200&q=85",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
  jaipur: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=85",
};

function getDestinationImage(destination) {
  const key = String(destination || "").trim().toLowerCase();
  const match = Object.keys(DESTINATION_IMAGES).find((city) => key.includes(city));
  return match ? DESTINATION_IMAGES[match] : DEFAULT_IMAGE;
}

function handleTripImageError(event, destination) {
  const image = event.currentTarget;
  if (!image.dataset.destinationFallback) {
    image.dataset.destinationFallback = "true";
    image.src = getDestinationImage(destination);
  } else if (!image.dataset.genericFallback) {
    image.dataset.genericFallback = "true";
    image.src = DEFAULT_IMAGE;
  } else {
    image.style.display = "none";
  }
}

function formatDate(date) {
  if (!date) return "Date not set";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Date not set";
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTripName(trip) {
  return trip?.title || trip?.name || trip?.destination || "My Trip";
}

function Dashboard({ onBack, onCreateTrip, onViewTrip }) {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Overview");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        if (token) {
          try {
            const userResponse = await API.get("/auth/me", { headers });
            if (mounted) setUser(userResponse.data);
          } catch (error) {
            console.warn("User information is unavailable.", error);
          }
        }

        const tripsResponse = await API.get("/trips", { headers });
        if (mounted) {
          setTrips(Array.isArray(tripsResponse.data) ? tripsResponse.data : []);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        if (mounted) setTrips([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const upcomingTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return trips
      .filter((trip) => trip.startDate && new Date(trip.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [trips]);

  const destinations = useMemo(
    () => new Set(trips.map((trip) => trip.destination?.trim()).filter(Boolean)),
    [trips]
  );

  const totalPlannedBudget = useMemo(
    () => trips.reduce((sum, trip) => sum + (Number(trip.budget) || 0), 0),
    [trips]
  );

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return trips;
    return trips.filter((trip) =>
      [trip.title, trip.name, trip.destination, trip.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [trips, search]);

  const logout = () => {
    localStorage.removeItem("token");
    onBack?.();
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Delete this trip? This action cannot be undone.")) return;

    try {
      setDeletingId(tripId);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await API.delete(`/trips/${tripId}`, { headers });
      setTrips((current) => current.filter((trip) => trip._id !== tripId));
    } catch (error) {
      console.error("Delete trip error:", error);
      window.alert(error?.response?.data?.message || "Could not delete this trip. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const goToTrips = (nav) => {
    setActiveNav(nav);
    const target = document.getElementById(nav === "Upcoming" ? "upcoming-trips" : "my-trips");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const monthLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const calendarStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const todayNumber = new Date().getDate();
  const calendarCells = [...Array(calendarStart).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  if (loading) {
    return (
      <main className="dashboard-loading dark-loading">
        <div className="loading-icon">✈</div>
        <h2>Preparing your TravelVerse</h2>
        <p>Loading your journeys from the cloud…</p>
      </main>
    );
  }

  const featuredTrip = upcomingTrips[0] || trips[0] || null;
  const firstName = user?.name?.trim()?.split(/\s+/)[0];

  return (
    <div className="dashboard tv-dashboard">
      <aside className="tv-sidebar">
        <button className="tv-brand" onClick={onBack} aria-label="TravelVerse home">
          <span className="tv-brand-mark">✈</span>
          <span className="tv-brand-copy"><strong>TravelVerse</strong><small>CLOUD TRAVEL PLATFORM</small></span>
        </button>

        <div className="tv-sidebar-label">WORKSPACE</div>
        <nav className="tv-side-nav" aria-label="Dashboard navigation">
          <button className={activeNav === "Overview" ? "active" : ""} onClick={() => { setActiveNav("Overview"); window.scrollTo({ top: 0, behavior: "smooth" }); }}><span>◫</span> Overview</button>
          <button className={activeNav === "My Trips" ? "active" : ""} onClick={() => goToTrips("My Trips")}><span>✈</span> My Trips <b>{trips.length}</b></button>
          <button className={activeNav === "Upcoming" ? "active" : ""} onClick={() => goToTrips("Upcoming")}><span>▦</span> Upcoming <b>{upcomingTrips.length}</b></button>
          <button onClick={onCreateTrip}><span>＋</span> Create a trip</button>
        </nav>

        <div className="tv-sidebar-label tv-sidebar-label-lower">YOUR CLOUD</div>
        <div className="tv-cloud-mini">
          <span className="tv-cloud-mini-icon">☁</span>
          <div><strong>Cloud connected</strong><small>Travel data synced through API</small></div>
          <i aria-label="Status online" />
        </div>

        <div className="tv-sidebar-spacer" />
        <button className="tv-side-bottom" onClick={onBack}><span>⌂</span> Home page</button>
        <button className="tv-side-bottom tv-logout" onClick={logout}><span>↪</span> Log out</button>
        <div className="tv-sidebar-user">
          <div className="tv-avatar">{(firstName || "T").charAt(0).toUpperCase()}</div>
          <div className="tv-user-copy"><strong>{user?.name || "Travel explorer"}</strong><small>TravelVerse member</small></div>
          <span className="tv-user-menu">•••</span>
        </div>
      </aside>

      <main className="tv-main">
        <header className="tv-topbar">
          <div className="tv-breadcrumb"><span>Workspace</span><span>/</span><strong>Overview</strong></div>
          <div className="tv-topbar-actions">
            <label className="tv-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search trips or destinations" aria-label="Search trips" />{search && <button onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>
            <span className="tv-topbar-divider" />
            <div className="tv-topbar-avatar" title={user?.name || "TravelVerse user"}>{(firstName || "T").charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="tv-content">
          <section className="tv-welcome-row">
            <div>
              <div className="tv-eyebrow"><span className="tv-live-dot" /> YOUR TRAVEL CLOUD</div>
              <h1>Welcome back{firstName ? `, ${firstName}` : ""}<span className="tv-title-period">.</span></h1>
              <p>Your next great journey starts with a plan.</p>
            </div>
            <button className="tv-primary-btn" onClick={onCreateTrip}><span>＋</span> Create new trip</button>
          </section>

          <section className="tv-stat-grid" aria-label="Travel statistics">
            <article className="tv-stat-card"><div className="tv-stat-icon violet">✈</div><div><span>Total trips</span><strong>{trips.length}</strong><small>Across your travel plans</small></div><span className="tv-stat-decoration">↗</span></article>
            <article className="tv-stat-card"><div className="tv-stat-icon blue">▦</div><div><span>Upcoming trips</span><strong>{upcomingTrips.length}</strong><small>Ready for takeoff</small></div><span className="tv-stat-decoration">↗</span></article>
            <article className="tv-stat-card"><div className="tv-stat-icon cyan">◎</div><div><span>Destinations</span><strong>{destinations.size}</strong><small>Places on your map</small></div><span className="tv-stat-decoration">↗</span></article>
            <article className="tv-stat-card"><div className="tv-stat-icon amber">₹</div><div><span>Planned budget</span><strong>{totalPlannedBudget.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</strong><small>Across all saved trips</small></div><span className="tv-stat-decoration">↗</span></article>
          </section>

          <section className="tv-feature-grid">
            <article className="tv-panel tv-next-trip">
              <div className="tv-panel-heading"><div><span className="tv-panel-kicker">UP NEXT</span><h2>Your next adventure</h2></div><span className="tv-panel-symbol">✦</span></div>
              {featuredTrip ? (
                <div className="tv-featured-trip">
                  <div className="tv-featured-image"><img src={featuredTrip.image || getDestinationImage(featuredTrip.destination)} alt={`${featuredTrip.destination || "Travel destination"} scenery`} onError={(event) => handleTripImageError(event, featuredTrip.destination)} /><span className="tv-featured-image-shade" /></div>
                  <div className="tv-featured-copy"><span className="tv-trip-pill"><i /> {featuredTrip.status || "Planned"}</span><h3>{getTripName(featuredTrip)}</h3><p>⌖ {featuredTrip.destination || "Destination not set"}</p><div className="tv-featured-date">▦ <span>{formatDate(featuredTrip.startDate)}</span></div><button className="tv-text-button" onClick={() => onViewTrip?.(featuredTrip)}>Open trip <span>↗</span></button></div>
                </div>
              ) : (
                <div className="tv-no-featured"><span>✈</span><h3>Your next adventure awaits</h3><p>Create a trip to see your next destination here.</p><button className="tv-text-button" onClick={onCreateTrip}>Plan a trip <span>→</span></button></div>
              )}
            </article>

            <article className="tv-panel tv-budget-panel">
              <div className="tv-panel-heading"><div><span className="tv-panel-kicker">TRAVEL FINANCES</span><h2>Budget overview</h2></div><span className="tv-panel-symbol">₹</span></div>
              <div className="tv-budget-total"><span>Total planned budget</span><strong>{totalPlannedBudget.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</strong></div>
              <div className="tv-budget-track"><span style={{ width: trips.length ? "100%" : "0%" }} /></div>
              <div className="tv-budget-legend"><span><i className="tv-legend-dot" /> Budgets assigned to trips</span><strong>{trips.filter((trip) => Number(trip.budget) > 0).length} / {trips.length}</strong></div>
              <div className="tv-budget-divider" />
              <div className="tv-budget-foot"><span className="tv-budget-foot-icon">↗</span><div><strong>Stay in control</strong><small>Review each trip budget before you go.</small></div></div>
              <button className="tv-outline-btn" onClick={() => goToTrips("My Trips")}>Review trip budgets <span>→</span></button>
            </article>

            <article className="tv-panel tv-calendar-panel">
              <div className="tv-panel-heading"><div><span className="tv-panel-kicker">YOUR SCHEDULE</span><h2>{monthLabel}</h2></div><span className="tv-calendar-icon">▦</span></div>
              <div className="tv-calendar-grid tv-calendar-weekdays">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day}>{day}</span>)}</div>
              <div className="tv-calendar-grid tv-calendar-days">{calendarCells.map((day, index) => {
                const hasTrip = day && trips.some((trip) => trip.startDate && new Date(trip.startDate).getFullYear() === new Date().getFullYear() && new Date(trip.startDate).getMonth() === new Date().getMonth() && new Date(trip.startDate).getDate() === day);
                return <span key={`${day ?? "blank"}-${index}`} className={[!day ? "blank" : "", day === todayNumber ? "today" : "", hasTrip ? "has-trip" : ""].filter(Boolean).join(" ")}>{day || ""}{hasTrip && <i />}</span>;
              })}</div>
              <div className="tv-calendar-note"><span><i className="tv-calendar-key today-key" /> Today</span><span><i className="tv-calendar-key trip-key" /> Trip start</span></div>
            </article>
          </section>

          <section className="tv-panel tv-map-panel">
            <div className="tv-panel-heading"><div><span className="tv-panel-kicker">YOUR WORLD, YOUR WAY</span><h2>Explore your journeys</h2><p>Your saved destinations, all in one place.</p></div><span className="tv-map-count">{destinations.size} {destinations.size === 1 ? "destination" : "destinations"}</span></div>
            <div className="tv-map-visual" aria-label="Decorative world map illustration">
              <svg className="tv-world-map" viewBox="0 0 900 300" role="img" aria-label="Stylized world map with destination markers">
                <defs><pattern id="tv-map-dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.35" fill="#7f8cae" opacity=".55" /></pattern></defs>
                <path fill="url(#tv-map-dots)" d="M73 68l35-24 49 8 23 20 41-6 27 18-10 26-29 8-8 29-23 13-12 37-20 11-18-32-26-8-13-32-28-14-10-28-28-9z M246 183l28 8 18 28-8 34-16 18-13-29-21-19z M340 66l34-23 45 8 21 18 35-7 35 20 28-1 29 23-12 21-33 4-8 21-27 6-19 26-25-2-19-24-27-3-12-25-27-8-7-27-20-4z M420 164l29-8 32 19 20 29-6 35-22 34-18-12-8-34-20-15z M533 76l34-14 38 11 13 22 31-1 25 19-11 22-34 3-18 18-22-5-9-24-26-5-15-20-20-3z M644 172l37-19 37 10 17 22-13 17-35-4-22 17-18-14z M730 218l27-10 27 11-3 17-34 7z" />
                {destinations.size > 0 && <g className="tv-map-marker"><circle cx="470" cy="143" r="13" fill="#8b78ff" opacity=".17" /><circle cx="470" cy="143" r="5" fill="#a99bff" /><circle cx="470" cy="143" r="2" fill="#fff" /></g>}
                <g className="tv-map-marker marker-two"><circle cx="205" cy="112" r="12" fill="#53d6cf" opacity=".16" /><circle cx="205" cy="112" r="4" fill="#53d6cf" /></g>
                <g className="tv-map-marker marker-three"><circle cx="645" cy="115" r="12" fill="#f4bf68" opacity=".16" /><circle cx="645" cy="115" r="4" fill="#f4bf68" /></g>
              </svg>
              <div className="tv-map-overlay"><span className="tv-map-globe">◎</span><div><strong>{destinations.size ? [...destinations].slice(0, 3).join(" · ") : "Your next destination"}</strong><small>{destinations.size ? "From your saved trips" : "Your travel map will grow as you add trips"}</small></div></div>
            </div>
          </section>

          <section className="tv-trips-section" id="upcoming-trips">
            <div className="tv-section-heading"><div><span className="tv-panel-kicker">ON THE HORIZON</span><h2>Upcoming trips</h2><p>Keep your next adventures close at hand.</p></div><button className="tv-outline-btn tv-heading-button" onClick={onCreateTrip}>＋ New trip</button></div>
            {upcomingTrips.length ? <div className="tv-upcoming-list">{upcomingTrips.slice(0, 3).map((trip) => <button className="tv-upcoming-item" key={trip._id} onClick={() => onViewTrip?.(trip)}><img src={trip.image || getDestinationImage(trip.destination)} alt={`${trip.destination || "Travel destination"} scenery`} onError={(event) => handleTripImageError(event, trip.destination)} /><div className="tv-upcoming-name"><strong>{getTripName(trip)}</strong><span>⌖ {trip.destination || "Destination not set"}</span></div><div className="tv-upcoming-date"><small>START DATE</small><strong>{formatDate(trip.startDate)}</strong></div><div className="tv-upcoming-budget"><small>BUDGET</small><strong>₹{Number(trip.budget || 0).toLocaleString("en-IN")}</strong></div><span className="tv-upcoming-arrow">↗</span></button>)}</div> : <div className="tv-empty-upcoming"><span>✈</span><div><strong>No upcoming trips yet</strong><p>When you plan a future journey, it will appear here.</p></div><button className="tv-text-button" onClick={onCreateTrip}>Create a trip →</button></div>}
          </section>

          <section className="tv-trips-section" id="my-trips">
            <div className="tv-section-heading"><div><span className="tv-panel-kicker">YOUR COLLECTION</span><h2>All trips</h2><p>{search ? `Search results for “${search}”` : "Every journey you've saved to TravelVerse."}</p></div><span className="tv-map-count">{filteredTrips.length} {filteredTrips.length === 1 ? "trip" : "trips"}</span></div>
            {filteredTrips.length ? <div className="tv-trip-grid">{filteredTrips.map((trip) => <article className="tv-trip-card" key={trip._id}><button className="tv-trip-card-image" onClick={() => onViewTrip?.(trip)} aria-label={`View ${getTripName(trip)}`}><img className="tv-trip-card-photo" src={trip.image || getDestinationImage(trip.destination)} alt={`${trip.destination || "Travel destination"} scenery`} onError={(event) => handleTripImageError(event, trip.destination)} /><span className="tv-trip-card-shade" /><span className="tv-trip-pill"><i /> {trip.status || "Planned"}</span><span className="tv-trip-image-destination">⌖ {trip.destination || "Destination"}</span></button><div className="tv-trip-card-body"><h3>{getTripName(trip)}</h3><div className="tv-trip-card-meta"><span>▦ {formatDate(trip.startDate)}</span><strong>₹{Number(trip.budget || 0).toLocaleString("en-IN")}</strong></div><div className="tv-trip-card-actions"><button className="tv-text-button" onClick={() => onViewTrip?.(trip)}>View details <span>→</span></button><button className="tv-delete-button" onClick={() => handleDeleteTrip(trip._id)} disabled={deletingId === trip._id} title="Delete trip" aria-label={`Delete ${getTripName(trip)}`}>{deletingId === trip._id ? "…" : "⌫"}</button></div></div></article>)}</div> : <div className="tv-empty-upcoming"><span>⌕</span><div><strong>{search ? "No matching trips" : "Your journey starts here"}</strong><p>{search ? "Try another destination or trip name." : "Create your first trip and it will appear in this collection."}</p></div>{!search && <button className="tv-text-button" onClick={onCreateTrip}>Create a trip →</button>}</div>}
          </section>

          <footer className="tv-footer"><span>✈ TravelVerse</span><span>Cloud-connected travel planning · © 2026</span><button onClick={onBack}>Back to home ↑</button></footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
