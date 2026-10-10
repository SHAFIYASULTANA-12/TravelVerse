import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Weather from "../components/weather";
import PlacePhoto from "../components/placephoto";
import TransportPlanner from "../components/TransportPlanner";
import "./TripDetails.css";

/* =========================================================
   DESTINATION DATA
   ========================================================= */

const destinationData = {
  delhi: {
    attractions: [
      {
        name: "India Gate",
        type: "Landmark",
        description:
          "Visit the iconic India Gate and enjoy the surrounding Kartavya Path.",
      },
      {
        name: "Red Fort",
        type: "Historical",
        description:
          "Explore one of Delhi's most important Mughal monuments.",
      },
      {
        name: "Qutub Minar",
        type: "Historical",
        description:
          "Visit the famous UNESCO World Heritage monument.",
      },
      {
        name: "Humayun's Tomb",
        type: "Historical",
        description:
          "Explore beautiful Mughal architecture and gardens.",
      },
      {
        name: "Lotus Temple",
        type: "Architecture",
        description:
          "Visit the peaceful lotus-shaped temple.",
      },
      {
        name: "Connaught Place",
        type: "Shopping",
        description:
          "Explore shopping streets, cafes and restaurants.",
      },
    ],

    restaurants: [
      {
        name: "Karim's",
        type: "Indian",
        description:
          "Popular Old Delhi restaurant known for Mughlai food.",
      },
      {
        name: "Indian Accent",
        type: "Fine Dining",
        description:
          "Modern Indian cuisine and fine dining experience.",
      },
      {
        name: "Paranthe Wali Gali",
        type: "Local Food",
        description:
          "Try traditional stuffed parathas in Old Delhi.",
      },
      {
        name: "Chole Bhature Spots",
        type: "Street Food",
        description:
          "Try Delhi's famous chole bhature.",
      },
      {
        name: "Jama Masjid Food Street",
        type: "Local Food",
        description:
          "Explore famous Old Delhi food and street snacks.",
      },
      {
        name: "Connaught Place Cafes",
        type: "Cafe",
        description:
          "Enjoy cafes and restaurants around central Delhi.",
      },
    ],

    hotels: [
      {
        name: "The Lalit New Delhi",
        area: "Connaught Place",
        price: "₹6,000 – ₹10,000/night",
        rating: "4.4/5",
      },
      {
        name: "Bloomrooms @ Janpath",
        area: "Central Delhi",
        price: "₹3,000 – ₹5,000/night",
        rating: "4.3/5",
      },
      {
        name: "Hotel Hari Piorko",
        area: "Paharganj",
        price: "₹1,500 – ₹3,000/night",
        rating: "4.0/5",
      },
    ],

    foods: [
      "Butter Chicken",
      "Chole Bhature",
      "Delhi-style Paratha",
      "Momos",
      "Chaat",
    ],
  },

  munnar: {
    attractions: [
      {
        name: "Mattupetty Dam",
        type: "Nature",
        description:
          "Enjoy the scenic reservoir surrounded by the Western Ghats.",
      },
      {
        name: "Echo Point",
        type: "Nature",
        description:
          "Enjoy mountain views and the famous echo phenomenon.",
      },
      {
        name: "Tea Museum",
        type: "Culture",
        description:
          "Learn about Munnar's tea history and production.",
      },
      {
        name: "Tea Gardens",
        type: "Scenic",
        description:
          "Walk through Munnar's beautiful tea plantations.",
      },
      {
        name: "Eravikulam National Park",
        type: "Wildlife",
        description:
          "Explore the mountain ecosystem and wildlife.",
      },
      {
        name: "Top Station",
        type: "Viewpoint",
        description:
          "Enjoy panoramic views of the Western Ghats.",
      },
    ],

    restaurants: [
      {
        name: "Rasa Gurukulam",
        type: "Kerala Food",
        description:
          "Try traditional Kerala cuisine.",
      },
      {
        name: "Saravana Bhavan",
        type: "South Indian",
        description:
          "Popular vegetarian South Indian food.",
      },
      {
        name: "Rochas Restaurant",
        type: "Restaurant",
        description:
          "Enjoy local and Indian dishes.",
      },
      {
        name: "Local Tea Cafes",
        type: "Cafe",
        description:
          "Try fresh tea and local snacks.",
      },
    ],

    hotels: [
      {
        name: "Blanket Hotel & Spa",
        area: "Attukad",
        price: "₹7,000 – ₹12,000/night",
        rating: "4.5/5",
      },
      {
        name: "The Munnar Queen",
        area: "Chithirapuram",
        price: "₹4,000 – ₹7,000/night",
        rating: "4.3/5",
      },
      {
        name: "Zostel Munnar",
        area: "Anachal",
        price: "₹800 – ₹2,000/night",
        rating: "4.4/5",
      },
    ],

    foods: [
      "Kerala Parotta",
      "Appam & Stew",
      "Puttu & Kadala Curry",
      "Kerala Sadya",
      "Tea & Local Snacks",
    ],
  },

  paris: {
    attractions: [
      {
        name: "Eiffel Tower",
        type: "Landmark",
        description:
          "Visit Paris's most famous landmark.",
      },
      {
        name: "Louvre Museum",
        type: "Museum",
        description:
          "Explore one of the world's largest museums.",
      },
      {
        name: "Arc de Triomphe",
        type: "Landmark",
        description:
          "Visit the famous monument at the end of Champs-Élysées.",
      },
      {
        name: "Montmartre",
        type: "Culture",
        description:
          "Explore the artistic streets of Paris.",
      },
      {
        name: "Notre-Dame",
        type: "Architecture",
        description:
          "Visit the historic cathedral area.",
      },
      {
        name: "Seine River",
        type: "Scenic",
        description:
          "Enjoy a walk or river cruise along the Seine.",
      },
    ],

    restaurants: [
      {
        name: "French Bistro",
        type: "French",
        description:
          "Try classic French dishes in a traditional setting.",
      },
      {
        name: "Local Creperie",
        type: "Cafe",
        description:
          "Enjoy traditional French crepes.",
      },
      {
        name: "Paris Bakery",
        type: "Bakery",
        description:
          "Try fresh croissants and baguettes.",
      },
      {
        name: "Montmartre Cafes",
        type: "Cafe",
        description:
          "Relax at a cafe around Montmartre.",
      },
    ],

    hotels: [
      {
        name: "Hôtel Malte – Astotel",
        area: "1st Arrondissement",
        price: "€120 – €220/night",
        rating: "4.4/5",
      },
      {
        name: "Novotel Paris Centre Tour Eiffel",
        area: "15th Arrondissement",
        price: "€130 – €250/night",
        rating: "4.1/5",
      },
      {
        name: "Generator Paris",
        area: "10th Arrondissement",
        price: "€50 – €100/night",
        rating: "4.0/5",
      },
    ],

    foods: [
      "Croissants",
      "Crêpes",
      "French Onion Soup",
      "Baguette Sandwiches",
      "Macarons",
    ],
  },
};

/* =========================================================
   FALLBACK DATA
   ========================================================= */

function getDestinationData(destination) {
  const key = String(destination || "")
    .trim()
    .toLowerCase();

  const matchedKey = Object.keys(destinationData).find(
    (city) =>
      key === city ||
      key.startsWith(`${city},`) ||
      key.startsWith(`${city} `)
  );

  if (matchedKey) {
    return destinationData[matchedKey];
  }

  return { attractions: [], restaurants: [], hotels: [], foods: [] };
}

// Curated famous dishes are kept separate from live map results because
// OpenStreetMap returns places, not a reliable list of regional dishes.
const famousFoodsByDestination = {
  london: ["Fish and Chips", "Full English Breakfast", "Sunday Roast", "Afternoon Tea", "Sticky Toffee Pudding"],
  england: ["Fish and Chips", "Full English Breakfast", "Sunday Roast", "Afternoon Tea", "Sticky Toffee Pudding"],
  uk: ["Fish and Chips", "Full English Breakfast", "Sunday Roast", "Afternoon Tea", "Sticky Toffee Pudding"],
  paris: ["Croissants", "Crêpes", "French Onion Soup", "Baguette", "Macarons"],
  france: ["Croissants", "Crêpes", "French Onion Soup", "Baguette", "Macarons"],
  tokyo: ["Sushi", "Ramen", "Tempura", "Tonkatsu", "Taiyaki"],
  japan: ["Sushi", "Ramen", "Tempura", "Tonkatsu", "Taiyaki"],
  delhi: ["Chole Bhature", "Butter Chicken", "Parathas", "Aloo Tikki Chaat", "Momos"],
  mumbai: ["Vada Pav", "Pav Bhaji", "Bombay Sandwich", "Bhel Puri", "Misal Pav"],
  chennai: ["Idli and Sambar", "Masala Dosa", "Pongal", "Filter Coffee", "Sundal"],
  kerala: ["Appam and Stew", "Puttu and Kadala Curry", "Kerala Sadya", "Malabar Parotta", "Karimeen Pollichathu"],
  munnar: ["Appam and Stew", "Puttu and Kadala Curry", "Kerala Sadya", "Malabar Parotta", "Kerala Banana Chips"],
  singapore: ["Hainanese Chicken Rice", "Chilli Crab", "Laksa", "Char Kway Teow", "Kaya Toast"],
  dubai: ["Shawarma", "Al Harees", "Machboos", "Luqaimat", "Knafeh"],
  rome: ["Carbonara", "Cacio e Pepe", "Supplì", "Pizza al Taglio", "Gelato"],
  italy: ["Carbonara", "Cacio e Pepe", "Pizza", "Risotto", "Gelato"],
  "new york": ["New York Pizza", "Bagel with Cream Cheese", "Pastrami Sandwich", "Cheesecake", "Hot Dog"],
};

function getFamousFoods(destination) {
  const city = String(destination || "").trim().toLowerCase();
  const match = Object.keys(famousFoodsByDestination).find((name) =>
    city === name || city.startsWith(`${name},`) || city.startsWith(`${name} `) || city.includes(name)
  );
  if (match) return famousFoodsByDestination[match];

  const savedFoods = getDestinationData(destination).foods || [];
  return savedFoods.length ? savedFoods : ["Local Speciality", "Traditional Main Dish", "Popular Street Food", "Regional Dessert", "Local Favourite"];
}

// Stable image URLs are used so each famous-food card can show a photo.
// If an image cannot load, the card falls back to its emoji and dish name.
const foodPhotoByKeyword = [
  { terms: ["fish and chips"], url: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&w=700&q=80" },
  { terms: ["english breakfast", "breakfast"], url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80" },
  { terms: ["sunday roast", "roast"], url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80" },
  { terms: ["afternoon tea", "tea"], url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80" },
  { terms: ["pudding", "macaron", "cake", "gelato", "taiyaki", "knafeh", "luqaimat", "cheesecake"], url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80" },
  { terms: ["sushi"], url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80" },
  { terms: ["ramen"], url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80" },
  { terms: ["pizza", "pav bhaji", "pav", "sandwich", "bagel", "burger", "hot dog"], url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80" },
  { terms: ["croissant", "crêpe", "crepe", "baguette"], url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80" },
  { terms: ["dosa", "idli", "puttu", "appam", "parotta", "sadya", "pongal", "vada pav", "misal pav", "chaat", "chole", "momos"], url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80" },
  { terms: ["chicken", "shawarma", "machboos", "harees", "carbonara", "cacio", "risotto", "laksa", "crab", "tempura", "tonkatsu"], url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80" },
];

function getFoodPhoto(food) {
  const name = String(food || "").toLowerCase();
  return foodPhotoByKeyword.find((item) => item.terms.some((term) => name.includes(term)))?.url
    || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80";
}

/* =========================================================
   LIVE PLACES (OpenStreetMap / Overpass)
   ========================================================= */

function getPlaceCategory(tags = {}) {
  if (tags.tourism === "hotel" || tags.tourism === "hostel" || tags.tourism === "guest_house") return "hotel";
  if (tags.amenity === "restaurant" || tags.amenity === "cafe" || tags.amenity === "fast_food" || tags.amenity === "food_court") return "restaurant";
  return "attraction";
}

function getPlaceType(tags = {}) {
  return tags.tourism || tags.amenity || tags.historic || tags.leisure || "Place";
}

function getPlaceDescription(tags = {}) {
  const details = [
    tags.cuisine ? `Cuisine: ${String(tags.cuisine).replaceAll(";", ", ")}.` : "",
    tags["addr:suburb"] || tags["addr:city"] ? `Area: ${tags["addr:suburb"] || tags["addr:city"]}.` : "",
    tags.opening_hours ? `Opening hours: ${tags.opening_hours}.` : "",
  ].filter(Boolean);
  return details.join(" ") || "Place listed in OpenStreetMap. Check the map listing for current details.";
}

// Curated headline landmarks ensure the most famous sights appear first even
// when OpenStreetMap has incomplete tagging or returns minor nearby places.
const headlineAttractions = {
  dubai: [
    ["Burj Khalifa", "Iconic skyscraper and observation decks in Downtown Dubai."],
    ["Dubai Mall", "Major shopping, dining and entertainment destination beside Burj Khalifa."],
    ["Museum of the Future", "Landmark museum exploring future science and technology."],
    ["Palm Jumeirah", "Famous palm-shaped island with resorts, beaches and viewpoints."],
    ["Burj Al Arab", "Dubai's distinctive sail-shaped luxury hotel and landmark."],
    ["Dubai Frame", "Large frame-shaped landmark with city views."],
    ["Dubai Marina", "Waterfront district known for its skyline, promenades and dining."],
    ["Jumeirah Mosque", "Well-known mosque noted for its architecture and visitor tours."],
    ["Dubai Creek", "Historic waterway associated with old Dubai and abra boat rides."],
    ["Al Fahidi Historical Neighbourhood", "Historic district with traditional architecture and museums."],
    ["Atlantis, The Palm", "Famous resort and Aquaventure waterpark destination."],
    ["Global Village", "Seasonal cultural, food and entertainment destination."],
  ],
  paris: [
    ["Eiffel Tower", "Paris's iconic tower and observation landmark."],
    ["Louvre Museum", "World-famous art museum home to the Mona Lisa."],
    ["Notre-Dame Cathedral", "Historic Gothic cathedral on the Île de la Cité."],
    ["Arc de Triomphe", "Monument overlooking the Champs-Élysées."],
    ["Musée d'Orsay", "Major art museum in a former railway station."],
    ["Sacré-Cœur Basilica", "Hilltop basilica overlooking Paris from Montmartre."],
    ["Palace of Versailles", "Historic royal palace and gardens outside central Paris."],
  ],
  london: [
    ["Big Ben", "Iconic clock tower beside the Houses of Parliament."],
    ["Tower of London", "Historic fortress and home of the Crown Jewels."],
    ["Buckingham Palace", "Official London residence of the monarch."],
    ["Tower Bridge", "Famous bascule bridge across the River Thames."],
    ["British Museum", "Major museum with collections from world history."],
    ["London Eye", "Observation wheel with views across central London."],
  ],
  singapore: [
    ["Gardens by the Bay", "Famous waterfront nature park and Supertree Grove."],
    ["Marina Bay Sands", "Iconic integrated resort and skyline landmark."],
    ["Merlion Park", "Waterfront home of Singapore's well-known Merlion statue."],
    ["Sentosa Island", "Resort island with beaches and major attractions."],
    ["Universal Studios Singapore", "Popular theme park on Sentosa Island."],
  ],
  delhi: [
    ["India Gate", "Iconic war memorial on Kartavya Path."],
    ["Red Fort", "Historic Mughal fort and UNESCO World Heritage Site."],
    ["Qutub Minar", "Famous UNESCO-listed minaret complex."],
    ["Humayun's Tomb", "Historic Mughal tomb and UNESCO World Heritage Site."],
    ["Lotus Temple", "Distinctive lotus-shaped Baháʼí House of Worship."],
    ["Akshardham Temple", "Large Hindu temple complex known for its architecture."],
  ],
  rome: [
    ["Colosseum", "Ancient Roman amphitheatre and one of Rome's best-known landmarks."],
    ["Trevi Fountain", "Famous Baroque fountain in central Rome."],
    ["Pantheon", "Remarkably preserved ancient Roman temple."],
    ["Roman Forum", "Archaeological area at the centre of ancient Roman public life."],
    ["Vatican Museums", "Major art museums including the Sistine Chapel."],
  ],
  tokyo: [
    ["Sensō-ji", "Historic Buddhist temple in Asakusa."],
    ["Tokyo Skytree", "Observation tower with panoramic city views."],
    ["Shibuya Crossing", "World-famous pedestrian crossing and city landmark."],
    ["Meiji Jingu", "Important Shinto shrine surrounded by forest."],
    ["Tokyo Tower", "Recognisable tower with observation decks."],
  ],
  "new york": [
    ["Statue of Liberty", "Iconic monument on Liberty Island."],
    ["Central Park", "Famous large urban park in Manhattan."],
    ["Empire State Building", "Historic skyscraper with observation decks."],
    ["Times Square", "Brightly lit entertainment and theatre district."],
    ["Brooklyn Bridge", "Historic bridge with skyline and river views."],
    ["Metropolitan Museum of Art", "Major art museum on Museum Mile."],
  ],
};

function getHeadlineAttractions(destination) {
  const normalized = String(destination || "").toLowerCase();
  const city = Object.keys(headlineAttractions).find((key) => normalized.includes(key));
  if (!city) return [];
  return headlineAttractions[city].map(([name, description], index) => ({
    name,
    type: "Top attraction",
    description,
    category: "attraction",
    priority: index,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${destination}`)}`,
  }));
}

function getPlacePopularityScore(place) {
  const name = String(place.name || "").toLowerCase();
  const type = String(place.type || "").toLowerCase();
  // Avoid ranking generic small parks/courtyards above named tourist sights.
  let score = 0;
  if (/world heritage|unesco|landmark|monument|museum|castle|palace|temple|cathedral|tower|historic/.test(type)) score += 35;
  if (/tourism attraction|museum|theme park|viewpoint|artwork|gallery/.test(type)) score += 25;
  if (/courtyard|residential|workshop|building|office|parking|garden south/.test(name)) score -= 30;
  if (/burj khalifa|eiffel tower|louvre|colosseum|statue of liberty|big ben|gardens by the bay/.test(name)) score += 100;
  return score;
}

async function fetchLiveDestinationPlaces(destination) {
  const cleanDestination = String(destination || "").trim();
  if (!cleanDestination) return null;

  const cacheKey = `travelverse_places_v2_${cleanDestination.toLowerCase()}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch {
    // Ignore unavailable session storage.
  }

  const geocodeUrl = new URL("https://nominatim.openstreetmap.org/search");
  geocodeUrl.search = new URLSearchParams({
    q: cleanDestination,
    format: "jsonv2",
    limit: "1",
  }).toString();

  const geoResponse = await fetch(geocodeUrl.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!geoResponse.ok) throw new Error("Could not find the destination on the map.");
  const locations = await geoResponse.json();
  if (!locations.length) throw new Error("Destination was not found on the map.");

  const { lat, lon } = locations[0];
  const query = `
    [out:json][timeout:25];
    (
      nwr(around:18000,${lat},${lon})["tourism"="attraction"];
      nwr(around:18000,${lat},${lon})["historic"];
      nwr(around:18000,${lat},${lon})["amenity"~"^(restaurant|cafe|fast_food|food_court)$"];
      nwr(around:18000,${lat},${lon})["tourism"~"^(hotel|hostel|guest_house)$"];
      nwr(around:18000,${lat},${lon})["leisure"="park"];
    );
    out center tags;
  `;

  const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!overpassResponse.ok) throw new Error("The live places service is temporarily unavailable.");
  const result = await overpassResponse.json();
  const unique = new Map();

  for (const element of result.elements || []) {
    const tags = element.tags || {};
    const name = tags.name || tags["name:en"];
    if (!name) continue;
    const category = getPlaceCategory(tags);
    const key = `${category}:${name.toLowerCase()}`;
    if (unique.has(key)) continue;

    const center = element.center || element;
    const latitude = center.lat;
    const longitude = center.lon;
    const address = [tags["addr:street"], tags["addr:city"]].filter(Boolean).join(", ");
    const mapUrl = latitude && longitude
      ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${cleanDestination}`)}`;

    unique.set(key, {
      name,
      type: getPlaceType(tags),
      description: getPlaceDescription(tags),
      area: tags["addr:suburb"] || tags["addr:city"] || address || cleanDestination,
      price: "Check current rates",
      rating: "See map listing",
      mapUrl,
      category,
    });
  }

  const places = [...unique.values()];
  const curatedHeadliners = getHeadlineAttractions(cleanDestination);
  const liveAttractions = places
    .filter((place) => place.category === "attraction")
    .sort((a, b) => getPlacePopularityScore(b) - getPlacePopularityScore(a));
  const seenAttractionNames = new Set();
  const attractions = [...curatedHeadliners, ...liveAttractions].filter((place) => {
    const key = place.name.toLowerCase().trim();
    if (seenAttractionNames.has(key)) return false;
    seenAttractionNames.add(key);
    return true;
  }).slice(0, 12);

  const data = {
    attractions,
    restaurants: places.filter((place) => place.category === "restaurant").slice(0, 12),
    hotels: places.filter((place) => place.category === "hotel").slice(0, 8),
    foods: [],
  };

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // Cache is optional.
  }
  return data;
}

/* =========================================================
   DATE HELPERS
   ========================================================= */

function formatDate(date) {
  if (!date) {
    return "Date not set";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 1;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const difference =
    Math.ceil(
      (end - start) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return Math.max(1, difference);
}

function getDateForDay(startDate, dayNumber) {
  const date = new Date(startDate);

  // dayNumber is zero-based when generated by the itinerary loop.
  date.setDate(date.getDate() + dayNumber);

  return date;
}

function getDateKey(value) {
  if (!value) return "";

  // Date inputs and MongoDB ISO dates should match the original calendar day.
  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* =========================================================
   COMPONENT
   ========================================================= */

function TripDetails({
  tripId,
  id,
  trip: providedTrip,
  onBack,
}) {
  const [trip, setTrip] = useState(
    providedTrip || null
  );

  const [loading, setLoading] = useState(
    !providedTrip
  );

  const [error, setError] = useState("");

  const [livePlaces, setLivePlaces] = useState(null);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState("");


  /* =========================
     EXPLORE TAB
     ========================= */

  const [exploreTab, setExploreTab] =
    useState("attractions");

  /* Main section navigation: only one trip section is visible at a time. */
  const [activeSection, setActiveSection] = useState("overview");

  /* =========================
     ACTIVITY
     ========================= */

  const [showActivityForm, setShowActivityForm] =
    useState(false);

  const [addingActivity, setAddingActivity] =
    useState(false);

  const [activityMessage, setActivityMessage] =
    useState("");

  const [activityForm, setActivityForm] =
    useState({
      date: "",
      time: "",
      title: "",
      activity: "",
      location: "",
      description: "",
      duration: "",
    });

  /* =========================
     EXPENSE
     ========================= */

  const [showExpenseForm, setShowExpenseForm] =
    useState(false);

  const [addingExpense, setAddingExpense] =
    useState(false);

  const [expenseMessage, setExpenseMessage] =
    useState("");

  const [expenseForm, setExpenseForm] =
    useState({
      title: "",
      category: "Food",
      amount: "",
      date: "",
      description: "",
    });

  /* =========================
     TRIP ID
     ========================= */

  const actualTripId =
    tripId ||
    id ||
    providedTrip?._id ||
    providedTrip?.id;

  /* =======================================================
     LOAD TRIP
     ======================================================= */

  useEffect(() => {
    if (providedTrip) {
      setTrip(providedTrip);
      setLoading(false);
      return;
    }

    if (!actualTripId) {
      setError("No trip selected.");
      setLoading(false);
      return;
    }

    loadTrip();
  }, [actualTripId, providedTrip]);

  useEffect(() => {
    const destination = trip?.destination || trip?.location || trip?.city;
    if (!destination) return;

    let cancelled = false;
    setPlacesLoading(true);
    setPlacesError("");

    fetchLiveDestinationPlaces(destination)
      .then((data) => {
        if (!cancelled && data) setLivePlaces(data);
      })
      .catch((err) => {
        console.error("Live destination places error:", err);
        if (!cancelled) {
          // Keep headline sights visible even if the public map service is down.
          setLivePlaces({
            attractions: getHeadlineAttractions(destination),
            restaurants: [],
            hotels: [],
            foods: [],
          });
          setPlacesError("Showing well-known attractions. Live restaurant and hotel listings could not be loaded right now.");
        }
      })
      .finally(() => {
        if (!cancelled) setPlacesLoading(false);
      });

    return () => { cancelled = true; };
  }, [trip?.destination, trip?.location, trip?.city]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/trips/${actualTripId}`
      );

      setTrip(
        response.data.trip ||
          response.data
      );
    } catch (err) {
      console.error(
        "Trip details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load this trip."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     PLAN
     ======================================================= */

  const plan = useMemo(() => {
    if (!trip) {
      return null;
    }

    const destination =
      trip.destination ||
      trip.location ||
      trip.city ||
      "Your Destination";

    const data =
      livePlaces || getDestinationData(destination);

    const days = getDays(
      trip.startDate,
      trip.endDate
    );

    const generatedDays = [];

    for (let i = 0; i < days; i++) {
      const date = getDateForDay(trip.startDate, i);

      generatedDays.push({
        day: i + 1,
        date,
        attraction: data.attractions.length ? data.attractions[i % data.attractions.length] : null,
        restaurant: data.restaurants.length ? data.restaurants[i % data.restaurants.length] : null,
        hotel: data.hotels.length ? data.hotels[i % data.hotels.length] : null,
      });
    }

    return {
      destination,
      data,
      days,
      generatedDays,
    };
  }, [trip, livePlaces]);

  /* =======================================================
     ACTIVITY FUNCTIONS
     ======================================================= */

  const handleActivityChange = (e) => {
    setActivityForm({
      ...activityForm,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();

    setActivityMessage("");

    if (!activityForm.date) {
      setActivityMessage(
        "Please select a date."
      );
      return;
    }

    if (!activityForm.title) {
      setActivityMessage(
        "Please enter an activity title."
      );
      return;
    }

    if (!activityForm.activity) {
      setActivityMessage(
        "Please enter the activity."
      );
      return;
    }

    try {
      setAddingActivity(true);

      const response = await API.post(
        `/trips/${actualTripId}/itinerary`,
        activityForm
      );

      const updatedTrip =
        response.data.trip ||
        response.data;

      setTrip(updatedTrip);

      setActivityForm({
        date: "",
        time: "",
        title: "",
        activity: "",
        location: "",
        description: "",
        duration: "",
      });

      setActivityMessage(
        "Activity added successfully!"
      );

      setTimeout(() => {
        setActivityMessage("");
        setShowActivityForm(false);
      }, 1500);
    } catch (err) {
      console.error(err);

      setActivityMessage(
        err?.response?.data?.message ||
          "Failed to add activity."
      );
    } finally {
      setAddingActivity(false);
    }
  };

  /* =======================================================
     EXPENSE FUNCTIONS
     ======================================================= */

  const handleExpenseChange = (e) => {
    setExpenseForm({
      ...expenseForm,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    setExpenseMessage("");

    if (!expenseForm.title) {
      setExpenseMessage(
        "Please enter an expense title."
      );
      return;
    }

    if (
      !expenseForm.amount ||
      Number(expenseForm.amount) <= 0
    ) {
      setExpenseMessage(
        "Please enter a valid amount."
      );
      return;
    }

    if (!expenseForm.date) {
      setExpenseMessage(
        "Please select a date."
      );
      return;
    }

    try {
      setAddingExpense(true);

      const response = await API.post(
        `/trips/${actualTripId}/expenses`,
        {
          ...expenseForm,
          amount: Number(
            expenseForm.amount
          ),
        }
      );

      const updatedTrip =
        response.data.trip ||
        response.data;

      setTrip(updatedTrip);

      setExpenseForm({
        title: "",
        category: "Food",
        amount: "",
        date: "",
        description: "",
      });

      setExpenseMessage(
        "Expense added successfully!"
      );

      setTimeout(() => {
        setExpenseMessage("");
        setShowExpenseForm(false);
      }, 1500);
    } catch (err) {
      console.error(err);

      setExpenseMessage(
        err?.response?.data?.message ||
          "Failed to add expense."
      );
    } finally {
      setAddingExpense(false);
    }
  };

  /* =======================================================
     EXPENSE CALCULATIONS
     ======================================================= */

  const expenses =
    trip?.expenses || [];

  const totalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  const tripBudget =
    Number(trip?.budget || 0);

  const remainingBudget =
    tripBudget - totalExpenses;

  const budgetPercentage =
    tripBudget > 0
      ? Math.min(
          (totalExpenses /
            tripBudget) *
            100,
          100
        )
      : 0;

  const getCategoryTotal = (
    category
  ) => {
    return expenses
      .filter(
        (expense) =>
          expense.category
            ?.toLowerCase() ===
          category.toLowerCase()
      )
      .reduce(
        (total, expense) =>
          total +
          Number(
            expense.amount || 0
          ),
        0
      );
  };

  /* =======================================================
     SAVED ACTIVITIES
     ======================================================= */

  const savedActivities =
    trip?.itinerary || [];

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <div className="trip-loading-page">
        <div className="trip-loading-card">

          <div className="loading-plane">
            ✈️
          </div>

          <h2>
            Preparing your trip...
          </h2>

          <p>
            Loading your TravelVerse
            itinerary.
          </p>

        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (!trip || error) {
    return (
      <div className="trip-error-page">

        <div className="trip-error-card">

          <div className="error-icon">
            🗺️
          </div>

          <h1>
            Trip not found
          </h1>

          <p>
            {error ||
              "No trip selected."}
          </p>

          <button
            className="back-dashboard-btn"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     BUDGET SPLIT
     ======================================================= */

  const accommodationBudget =
    Math.round(
      tripBudget * 0.35
    );

  const foodBudget =
    Math.round(
      tripBudget * 0.20
    );

  const travelBudget =
    Math.round(
      tripBudget * 0.20
    );

  const activitiesBudget =
    Math.round(
      tripBudget * 0.20
    );

  const emergencyBudget =
    Math.round(
      tripBudget * 0.05
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="trip-details-page">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="trip-details-header" style={{ position: "relative", overflow: "hidden" }}>
        <PlacePhoto query={`${plan.destination} skyline landmark`} alt={`${plan.destination} destination`} asBackground />

        <button
          className="back-dashboard-btn"
          onClick={onBack}
          style={{ position: "relative", zIndex: 2 }}
        >
          ← Back to Dashboard
        </button>

        <div className="trip-header-content" style={{ position: "relative", zIndex: 1 }}>

          <span className="trip-overline">
            ✈️ TRAVELVERSE TRIP
          </span>

          <h1>
            {trip.title ||
              trip.name ||
              plan.destination}
          </h1>

          <p className="trip-destination">
            📍 {plan.destination}
          </p>

          {trip.description && (
            <p className="trip-description">
              {trip.description}
            </p>
          )}

          <div className="trip-summary">

            <div>
              <span>
                📅 TRAVEL DATES
              </span>

              <strong>
                {formatDate(
                  trip.startDate
                )}
                {" → "}
                {formatDate(
                  trip.endDate
                )}
              </strong>
            </div>

            <div>
              <span>
                ⏱️ DURATION
              </span>

              <strong>
                {plan.days}{" "}
                {plan.days === 1
                  ? "Day"
                  : "Days"}
              </strong>
            </div>

            <div>
              <span>
                💰 TOTAL BUDGET
              </span>

              <strong>
                ₹
                {tripBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div>
              <span>
                👥 TRAVELERS
              </span>

              <strong>
                {trip.travelers ||
                  trip.numberOfTravelers ||
                  1}
              </strong>
            </div>

          </div>

        </div>

      </header>


      <main className="trip-main">

        <nav className="trip-section-nav" aria-label="Trip details sections">
          {[
            { id: "overview", label: "☀️ Weather & Transport" },
            { id: "itinerary", label: "🗓️ Itinerary" },
            { id: "places", label: "📍 Places" },
            { id: "restaurants", label: "🍽️ Restaurants" },
            { id: "hotels", label: "🏨 Hotels" },
            { id: "food", label: "🥘 Food" },
            { id: "budget", label: "💰 Budget" },
            { id: "tips", label: "💡 Travel Tips" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeSection === item.id ? "active" : ""}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {activeSection === "overview" && (<>
        {/* =================================================
            WEATHER
        ================================================= */}

        <Weather
          destination={
            trip.destination
          }
        />

        {/* =================================================
            TRANSPORT PLANNER
        ================================================= */}

        <TransportPlanner trip={trip} />
        </>)}

        {/* =================================================
            EXPENSE HISTORY
        ================================================= */}

        {activeSection === "expenses" && (
        <section className="trip-feature-section">

          <div className="section-heading">

            <span>
              📋 SPENDING
            </span>

            <h2>
              Expense History
            </h2>

          </div>

          {expenses.length === 0 ? (

            <p className="empty-message">
              No expenses added yet.
              Click + Add Expense to
              start tracking your spending.
            </p>

          ) : (

            <div className="expense-list">

              {expenses.map(
                (expense, index) => (

                  <div
                    className="expense-row"
                    key={
                      expense._id ||
                      index
                    }
                  >

                    <div>

                      <strong>
                        {expense.title}
                      </strong>

                      <span>
                        {expense.category}
                        {" • "}
                        {formatDate(
                          expense.date
                        )}
                      </span>

                      {expense.description && (
                        <small>
                          {
                            expense.description
                          }
                        </small>
                      )}

                    </div>

                    <strong className="expense-amount">
                      ₹
                      {Number(
                        expense.amount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

          {expenses.length > 0 && (

            <div className="category-summary">

              {[
                "Food",
                "Hotel",
                "Transport",
                "Activities",
                "Shopping",
                "Other",
              ].map(
                (category) => (

                  <div
                    key={category}
                  >

                    <strong>
                      {category}
                    </strong>

                    <span>
                      ₹
                      {getCategoryTotal(
                        category
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>
        )}

        {/* =================================================
            YOUR DAY-BY-DAY ITINERARY
        ================================================= */}

        {activeSection === "itinerary" && (
        <section className="trip-feature-section daily-itinerary-section">
          <div className="section-heading-row">
            <div className="section-heading">
              <span>🗺️ DAILY PLAN</span>
              <h2>Your Day-by-Day Itinerary</h2>
              <p>Suggested places for every day, with your saved activities stored in the cloud.</p>
            </div>

            <button
              type="button"
              className="primary-small-btn"
              onClick={() => setShowActivityForm((current) => !current)}
            >
              {showActivityForm ? "✕ Close" : "+ Add Activity"}
            </button>
          </div>

          {showActivityForm && (
            <form className="trip-form" onSubmit={handleAddActivity}>
              <label className="itinerary-field">
                Travel date
                <input
                  type="date"
                  name="date"
                  min={getDateKey(trip.startDate)}
                  max={getDateKey(trip.endDate)}
                  value={activityForm.date}
                  onChange={handleActivityChange}
                  required
                />
              </label>

              <label className="itinerary-field">
                Time
                <input
                  type="time"
                  name="time"
                  value={activityForm.time}
                  onChange={handleActivityChange}
                />
              </label>

              <label className="itinerary-field">
                Activity title
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Visit a museum"
                  value={activityForm.title}
                  onChange={handleActivityChange}
                  required
                />
              </label>

              <label className="itinerary-field">
                Activity type
                <input
                  type="text"
                  name="activity"
                  placeholder="e.g. Sightseeing"
                  value={activityForm.activity}
                  onChange={handleActivityChange}
                  required
                />
              </label>

              <label className="itinerary-field">
                Location
                <input
                  type="text"
                  name="location"
                  placeholder="Place or address"
                  value={activityForm.location}
                  onChange={handleActivityChange}
                />
              </label>

              <label className="itinerary-field">
                Duration
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 2 hours"
                  value={activityForm.duration}
                  onChange={handleActivityChange}
                />
              </label>

              <textarea
                name="description"
                placeholder="Notes about this activity"
                value={activityForm.description}
                onChange={handleActivityChange}
              />

              {activityMessage && <p className="form-message">{activityMessage}</p>}

              <button type="submit" disabled={addingActivity}>
                {addingActivity ? "Saving..." : "Save Activity ☁️"}
              </button>
            </form>
          )}

          {activityMessage && !showActivityForm && (
            <p className="form-message itinerary-status-message">{activityMessage}</p>
          )}

          <div className="daily-itinerary-list">
            {plan.generatedDays.map((day) => {
              const dayKey = getDateKey(day.date);
              const dayActivities = savedActivities.filter(
                (activity) => getDateKey(activity.date) === dayKey
              );

              const attraction = day.attraction;
              const restaurant = day.restaurant;
              const hotel = day.hotel;

              return (
                <article className="daily-plan-card" key={day.day}>
                  <div className="daily-plan-heading">
                    <div className="day-number">{String(day.day).padStart(2, "0")}</div>
                    <div className="daily-plan-title">
                      <span className="daily-plan-label">DAY {day.day}</span>
                      <h3>
                        {day.date.toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <p>📍 {plan.destination}</p>
                    </div>
                  </div>

                  <div className="daily-plan-content">
                    {attraction && <div className="daily-suggestion">
                      <PlacePhoto query={`${attraction.name} ${plan.destination}`} alt={attraction.name} height={130} />
                      <span className="daily-suggestion-icon">🏛️</span>
                      <div>
                        <span className="daily-time">MORNING · SUGGESTED</span>
                        <h4>{attraction.name}</h4>
                        <p>{attraction.description}</p>
                        <a
                          href={attraction.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${attraction.name} ${plan.destination}`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open in Maps →
                        </a>
                      </div>
                    </div>}

                    {restaurant && <div className="daily-suggestion">
                      <PlacePhoto query={`${restaurant.name} ${plan.destination}`} alt={restaurant.name} height={130} />
                      <span className="daily-suggestion-icon">🍽️</span>
                      <div>
                        <span className="daily-time">AFTERNOON · FOOD</span>
                        <h4>{restaurant.name}</h4>
                        <p>{restaurant.description}</p>
                        <a
                          href={restaurant.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${plan.destination}`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Find on Maps →
                        </a>
                      </div>
                    </div>}

                    {hotel && <div className="daily-suggestion daily-hotel-suggestion">
                      <PlacePhoto query={`${hotel.name} ${hotel.area || plan.destination}`} alt={hotel.name} height={130} />
                      <span className="daily-suggestion-icon">🏨</span>
                      <div>
                        <span className="daily-time">STAY · SUGGESTION</span>
                        <h4>{hotel.name}</h4>
                        <p>{hotel.area ? `Area: ${hotel.area}. ` : ""}{hotel.price || "Check current rates"}</p>
                        <small className="hotel-disclaimer">Sample suggestion — verify current prices and availability.</small>
                        <a
                          href={hotel.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${plan.destination}`)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View hotel on Maps →
                        </a>
                      </div>
                    </div>}
                    {!attraction && !restaurant && !hotel && (
                      <p className="empty-message">No verified places were found for this day. Use the Destination Guide below to explore live map results.</p>
                    )}
                  </div>

                  <div className="saved-day-activities">
                    <h4>☁️ Your Saved Activities</h4>
                    {dayActivities.length === 0 ? (
                      <p className="no-day-activities">
                        Nothing saved for this date yet. Select “Add Activity” to add your own plan.
                      </p>
                    ) : (
                      dayActivities.map((activity, index) => (
                        <div className="saved-day-activity" key={activity._id || index}>
                          <span className="saved-activity-time">{activity.time || "Time not set"}</span>
                          <div>
                            <strong>{activity.title || activity.activity || "Activity"}</strong>
                            {activity.location && <p>📍 {activity.location}</p>}
                            {activity.description && <p>{activity.description}</p>}
                            {activity.duration && <small>Duration: {activity.duration}</small>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        )}

        {/* =================================================
            EXPLORE PLACES
        ================================================= */}

        {["places", "restaurants", "hotels"].includes(activeSection) && (
        <section className="explore-section">

          <div className="section-heading">

            <span>
              📍 DESTINATION GUIDE
            </span>

            <h2>
              Explore {plan.destination}
            </h2>

            <p>
              Real places from OpenStreetMap near {plan.destination}. Availability and details may vary.
            </p>
            <p className="places-status" role="status">
              {placesLoading
                ? "🔎 Finding real attractions, restaurants and hotels..."
                : placesError
                  ? placesError
                  : "Map data © OpenStreetMap contributors."}
            </p>

          </div>


          {/* ATTRACTIONS */}

          {activeSection === "places" && (

            <div className="explore-grid">

              {plan.data.attractions.length === 0 ? (
                <p className="empty-message">No attractions were found for this destination. Try a more specific city name.</p>
              ) : plan.data.attractions.map(
                (place, index) => (

                  <div
                    className="explore-card"
                    key={`${place.name}-${index}`}
                  >
                    <PlacePhoto query={`${place.name} ${plan.destination}`} alt={place.name} height={170} />
                    <div className="explore-card-icon">
                      🏛️
                    </div>

                    <span className="explore-type">
                      {place.type}
                    </span>

                    <h3>
                      {place.name}
                    </h3>

                    <p>
                      {place.description}
                    </p>

                    <a
                      href={place.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        place.name + " " + plan.destination
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🗺 Open in Maps →
                    </a>

                  </div>

                )
              )}

            </div>

          )}


          {/* RESTAURANTS */}

          {activeSection === "restaurants" && (

            <div className="explore-grid">

              {plan.data.restaurants.length === 0 ? (
                <p className="empty-message">No restaurant listings were found for this destination right now.</p>
              ) : plan.data.restaurants.map(
                (restaurant, index) => (

                  <div
                    className="explore-card"
                    key={`${restaurant.name}-${index}`}
                  >
                    <PlacePhoto query={`${restaurant.name} ${plan.destination}`} alt={restaurant.name} height={170} />
                    <div className="explore-card-icon">
                      🍽️
                    </div>

                    <span className="explore-type">
                      {restaurant.type}
                    </span>

                    <h3>
                      {restaurant.name}
                    </h3>

                    <p>
                      {restaurant.description}
                    </p>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        restaurant.name +
                          " " +
                          plan.destination
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🗺 Open in Maps →
                    </a>

                  </div>

                )
              )}

            </div>

          )}


          {/* HOTELS */}

          {activeSection === "hotels" && (

            <div className="hotel-grid">

              {plan.data.hotels.length === 0 ? (
                <p className="empty-message">No hotel listings were found for this destination right now.</p>
              ) : plan.data.hotels.map(
                (hotel, index) => (

                  <div
                    className="hotel-card"
                    key={`${hotel.name}-${index}`}
                  >

                    <div className="hotel-image">
                      <PlacePhoto query={`${hotel.name} ${hotel.area || plan.destination}`} alt={hotel.name} height={190} />
                    </div>

                    <div className="hotel-content">

                      <span className="hotel-label">
                        {hotel.area}
                      </span>

                      <h3>
                        {hotel.name}
                      </h3>

                      <p>
                        📍 {hotel.area}
                      </p>

                      <p>
                        ⭐ {hotel.rating}
                      </p>

                      <strong>
                        💰 {hotel.price}
                      </strong>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          hotel.name +
                            " " +
                            plan.destination
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        🗺 Find on Maps →
                      </a>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>
        )}

        {/* =================================================
            LOCAL FOOD
        ================================================= */}

        {activeSection === "food" && (
        <section className="food-section">

          <div className="section-heading">

            <span>
              🍽️ LOCAL FOOD
            </span>

            <h2>
              What You Should Try
            </h2>

            <p>
              Popular food experiences
              for your trip.
            </p>

          </div>

          <div className="food-grid">

            {getFamousFoods(plan.destination).map((food, index) => (
              <div className="food-card" key={food}>
                <img
                  className="food-card-image"
                  src={getFoodPhoto(food)}
                  alt={food}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="food-card-caption">
                  <span aria-hidden="true">{["🍽️", "🥘", "🍜", "🥐", "🍰"][index % 5]}</span>
                  <strong>{food}</strong>
                </div>
              </div>
            ))}

          </div>

        </section>
        )}

        {/* =================================================
            SUGGESTED BUDGET
        ================================================= */}

        {activeSection === "budget" && (
        <section className="budget-section">

          <div className="section-heading">

            <span>
              💰 BUDGET MANAGEMENT
            </span>

            <h2>
              Suggested Budget Split
            </h2>

            <p>
              A simple way to distribute
              your trip budget.
            </p>

          </div>

          <div className="budget-grid">

            <div className="budget-card">
              <span>🏨</span>
              <p>
                Accommodation
              </p>
              <strong>
                ₹
                {accommodationBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>
                35%
              </small>
            </div>

            <div className="budget-card">
              <span>🍽️</span>
              <p>
                Food
              </p>
              <strong>
                ₹
                {foodBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>
                20%
              </small>
            </div>

            <div className="budget-card">
              <span>🚕</span>
              <p>
                Travel
              </p>
              <strong>
                ₹
                {travelBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>
                20%
              </small>
            </div>

            <div className="budget-card">
              <span>🎟️</span>
              <p>
                Activities
              </p>
              <strong>
                ₹
                {activitiesBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>
                20%
              </small>
            </div>

            <div className="budget-card">
              <span>🛡️</span>
              <p>
                Emergency
              </p>
              <strong>
                ₹
                {emergencyBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
              <small>
                5%
              </small>
            </div>

          </div>

        </section>
        )}

        {/* =================================================
            TRAVEL TIPS
        ================================================= */}

        {activeSection === "tips" && (
        <section className="tips-section">

          <div className="section-heading">

            <span>
              💡 TRAVEL SMART
            </span>

            <h2>
              Trip Tips
            </h2>

          </div>

          <div className="tips-grid">

            <div>
              🎫

              <h3>
                Book Attractions Early
              </h3>

              <p>
                Reserve popular attractions
                in advance whenever possible.
              </p>
            </div>

            <div>
              🚕
              
              <h3>
                Plan Local Transport
              </h3>

              <p>
                Keep some budget available
                for taxis and public transport.
              </p>
            </div>

            <div>
              💳

              <h3>
                Keep Emergency Money
              </h3>

              <p>
                Avoid spending the entire
                budget on planned activities.
              </p>
            </div>

            <div>
              📱

              <h3>
                Keep Your Trip Offline
              </h3>

              <p>
                Save hotel details, tickets
                and important addresses.
              </p>
            </div>

          </div>

        </section>
        )}

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="trip-footer">

        <div>
          ☁️
          <strong>
            TravelVerse
          </strong>
        </div>

        <p>
          Your journey, planned and
          stored in the cloud.
        </p>

      </footer>

    </div>
  );
}

export default TripDetails;