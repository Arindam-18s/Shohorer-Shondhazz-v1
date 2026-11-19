const { Router } = require("express");

const router = Router();

// Builds a Tripadvisor search link, so you don't maintain individual URLs.
const tripadvisor = (query) =>
  `https://www.tripadvisor.in/Search?q=${encodeURIComponent(query + " Kolkata")}`;

const IMG = {
  specialty: "https://images.unsplash.com/photo-1751214608311-c1e01351426c?q=80&w=2159&auto=format&fit=crop",
  artMuseums: "https://images.unsplash.com/photo-1761984752674-70f1dcb24daa?w=600&auto=format&fit=crop&q=60",
  shoppingTours: "https://images.unsplash.com/photo-1728325444513-f6f7bdd0950a?w=600&auto=format&fit=crop&q=60",
  churches: "https://images.unsplash.com/photo-1761654683364-4f8d499a99c0?w=600&auto=format&fit=crop&q=60",
  holiday: "https://images.unsplash.com/photo-1668151133903-72da87fe1f40?w=600&auto=format&fit=crop&q=60",
  artClasses: "https://plus.unsplash.com/premium_photo-1704974610818-f8144dcf9549?w=600&auto=format&fit=crop&q=60",
  historicSites: "https://images.unsplash.com/photo-1640281689804-0ccb69ff6d77?w=600&auto=format&fit=crop&q=60",
  tuktuk: "https://images.unsplash.com/photo-1532681445580-8777da6822d6?q=80&w=600&auto=format&fit=crop",
  walking: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop",
  sacred: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600&auto=format&fit=crop",
  food: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop",
  architecture: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600&auto=format&fit=crop",
  photo: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=600&auto=format&fit=crop",
  art: "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=600&auto=format&fit=crop",
  histor: "https://images.unsplash.com/photo-1596422846543-73c1d4eebe28?q=80&w=600&auto=format&fit=crop",
  shopping: "https://images.unsplash.com/photo-1555529733-0e670560f4e1?q=80&w=600&auto=format&fit=crop",
  rail: "https://images.unsplash.com/photo-1532153258591-6b219b16892c?q=80&w=600&auto=format&fit=crop",
  bus: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop",
  park: "https://images.unsplash.com/photo-1508873760731-9c3d0bb6b961?q=80&w=600&auto=format&fit=crop",
  water: "https://images.unsplash.com/photo-1522067716155-25e407987e91?q=80&w=600&auto=format&fit=crop",
  cook: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?q=80&w=600&auto=format&fit=crop",
  museum: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&auto=format&fit=crop",
  sport: "https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=600&auto=format&fit=crop",
};

// tour(title, category, description, image, price, rating, searchTerm)
const tour = (title, category, description, image, price, rating, search) => ({
  title,
  category,
  description,
  image,
  price,
  rating,
  location: "Kolkata",
  url: tripadvisor(search),
});

const TOURS = [
  tour("Specialty Food Trail", "Food", "Sample Kolkata's signature specialties from local favourites.", IMG.specialty, "₹1500", "4.7", "specialty food tour"),
  tour("Art Museums Tour", "Art", "Visit the city's best museums and see modern and traditional Bengali art.", IMG.artMuseums, "₹1500", "4.6", "art museum tour"),
  tour("Shopping Tour", "Shopping", "Browse bustling bazaars for handicrafts, textiles and souvenirs.", IMG.shoppingTours, "₹1300", "4.4", "shopping tour"),
  tour("Churches & Cathedrals Walk", "Heritage", "Walk past St. Paul's Cathedral and other colonial-era churches.", IMG.churches, "₹1000", "4.5", "churches cathedrals tour"),
  tour("Holiday & Seasonal Tours", "Festival", "Experience the city's festivals and seasonal celebrations.", IMG.holiday, "₹2000", "4.8", "holiday seasonal tour"),
  tour("Art Classes", "Workshop", "Try your hand at painting or crafts with a local artist.", IMG.artClasses, "₹1200", "4.6", "art class kolkata"),
  tour("Historic Sites Tour", "History", "Visit the city's historic landmarks with a knowledgeable guide.", IMG.historicSites, "₹1400", "4.7", "historic sites tour"),
  tour("Tuk Tuk Adventure", "Adventure", "A fast, fun ride through busy lanes, markets and landmarks.", IMG.tuktuk, "₹900", "4.6", "tuk tuk tour"),
  tour("Walking Tour", "Walking", "An easy walk through the neighbourhoods with stories along the way.", IMG.walking, "₹800", "4.7", "walking tour"),
  tour("Sacred Sites Tour", "Spiritual", "Visit some of the city's most important temples and places of worship.", IMG.sacred, "₹1100", "4.7", "temple tour"),
  tour("Photography Walk", "Photography", "Discover the city's most photogenic corners with a photography guide.", IMG.photo, "₹1000", "4.5", "photography tour"),
  tour("Bengali Cooking Class", "Food", "Learn to cook classic Bengali dishes in a local kitchen.", IMG.cook, "₹2200", "4.8", "cooking class"),
  tour("Street Food Tasting", "Food", "Taste Kati Rolls, puchka and sweets from the city's best stalls.", IMG.food, "₹1800", "4.7", "street food tour"),
  tour("Architecture Walk", "Heritage", "Explore colonial and Indo-Saracenic buildings across the city.", IMG.architecture, "₹1200", "4.6", "architecture walking tour"),
  tour("Art Gallery Visit", "Art", "Browse contemporary and folk art in the city's galleries.", IMG.art, "₹1100", "4.5", "art gallery tour"),
  tour("Heritage Walk", "History", "Stroll through old streets and century-old mansions.", IMG.histor, "₹1300", "4.8", "heritage walk"),
  tour("Local Shopping Walk", "Shopping", "Explore markets for everyday finds and local crafts.", IMG.shopping, "₹1000", "4.4", "local market tour"),
  tour("Rail Journey Experience", "Transport", "Ride the trains and see the city the way locals do.", IMG.rail, "₹700", "4.5", "local train tour"),
  tour("Bus Sightseeing Tour", "Transport", "See the city from the top deck of a sightseeing bus.", IMG.bus, "₹900", "4.4", "bus sightseeing tour"),
  tour("Park & Nature Walk", "Nature", "Relax in the city's green spaces and lakes.", IMG.park, "₹600", "4.6", "park nature walk"),
  tour("Waterfront Cruise", "Water", "A relaxing boat ride along the Hooghly river.", IMG.water, "₹1600", "4.7", "hooghly river cruise"),
  tour("Museum Tour", "Museum", "A guided visit through one of India's oldest museums.", IMG.museum, "₹1200", "4.7", "indian museum tour"),
  tour("Sports Experience", "Sports", "Experience the city's sporting culture at a famous stadium.", IMG.sport, "₹1500", "4.5", "sports experience"),
];

router.get("/", (req, res) => {
  res.render("city-tours", { user: req.user, tours: TOURS });
});

module.exports = router;