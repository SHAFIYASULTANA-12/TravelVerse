const getPlaces = async (req, res) => {
  try {
    const { destination, category = "all" } = req.query;

    if (!destination) {
      return res.status(400).json({
        message: "Destination is required",
      });
    }

    if (!process.env.GEOAPIFY_API_KEY) {
      return res.status(500).json({
        message: "Geoapify API key is not configured",
      });
    }

    // -----------------------------------
    // STEP 1: Convert destination to coordinates
    // -----------------------------------

    const geocodeParams = new URLSearchParams({
      text: destination,
      format: "json",
      limit: "1",
      type: "city",
      apiKey: process.env.GEOAPIFY_API_KEY,
    });

    const geocodeResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?${geocodeParams}`
    );

    if (!geocodeResponse.ok) {
      return res.status(502).json({
        message: "Unable to find destination",
      });
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      return res.status(404).json({
        message: `Could not find location: ${destination}`,
      });
    }

    const location = geocodeData.results[0];

    const latitude = location.lat;
    const longitude = location.lon;

    // -----------------------------------
    // STEP 2: Decide what places to search
    // -----------------------------------

    let categories;

    if (category === "restaurants") {
      categories = "catering.restaurant";
    } else if (category === "hotels") {
      categories = "accommodation.hotel";
    } else if (category === "attractions") {
      categories = "tourism.attraction,tourism.sights";
    } else {
      categories =
        "tourism.attraction,tourism.sights,catering.restaurant,accommodation.hotel";
    }

    // -----------------------------------
    // STEP 3: Search nearby places
    // -----------------------------------

    const placesParams = new URLSearchParams({
      categories,
      filter: `circle:${longitude},${latitude},10000`,
      bias: `proximity:${longitude},${latitude}`,
      limit: "20",
      lang: "en",
      apiKey: process.env.GEOAPIFY_API_KEY,
    });

    const placesResponse = await fetch(
      `https://api.geoapify.com/v2/places?${placesParams}`
    );

    if (!placesResponse.ok) {
      const errorText = await placesResponse.text();

      console.error("Geoapify Places Error:", errorText);

      return res.status(502).json({
        message: "Unable to fetch nearby places",
      });
    }

    const placesData = await placesResponse.json();

    // -----------------------------------
    // STEP 4: Format results for frontend
    // -----------------------------------

    const places = (placesData.features || []).map((feature) => {
      const properties = feature.properties || {};

      let type = "place";

      if (
        properties.categories?.some((item) =>
          item.startsWith("tourism")
        )
      ) {
        type = "attraction";
      } else if (
        properties.categories?.some((item) =>
          item.startsWith("catering")
        )
      ) {
        type = "restaurant";
      } else if (
        properties.categories?.some((item) =>
          item.startsWith("accommodation")
        )
      ) {
        type = "hotel";
      }

      return {
        id: properties.place_id || `${properties.lat}-${properties.lon}`,
        name: properties.name || "Unnamed place",
        type,
        address:
          properties.formatted ||
          properties.address_line1 ||
          "Address unavailable",
        latitude: properties.lat,
        longitude: properties.lon,
        distance: properties.distance || null,
        categories: properties.categories || [],
      };
    });

    return res.json({
      destination: {
        name: location.city || location.name || destination,
        latitude,
        longitude,
      },
      places,
    });
  } catch (error) {
    console.error("Places API Error:", error);

    return res.status(500).json({
      message: "Server error while fetching places",
    });
  }
};

module.exports = {
  getPlaces,
};