require("dotenv").config();

const { Router } = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const router = Router();
const KEY = process.env.VIATOR_API_KEY;

const tourCache = new NodeCache({
    stdTTL: 604800,
    deleteOnExpire: false
});

router.get("/", async (req, res) => {
    const searchQuery = "Kolkata";
    const cacheKey = `tripadvisor_${searchQuery.toLowerCase()}`;

    try {
        const cachedData = tourCache.get(cacheKey);

        if (cachedData) {
            console.log(`⚡ Served [${searchQuery}] from Cache. ZERO API cost!`);
            return res.render("city-tours", {
                user: req.user,
                tours: cachedData
            });
        }

        console.log("📡 Cache miss. Fetching from Tripadvisor34 API...");

        const toursOptions = {
            method: "GET",
            url: "https://tripadvisor34.p.rapidapi.com/api/v1/things-to-do/experience-types",
            params: {
                location: searchQuery,
                currency: "INR"
            },
            headers: {
                "X-RapidAPI-Key": KEY,
                "X-RapidAPI-Host": "tripadvisor34.p.rapidapi.com"
            }
        };

        const response = await axios.request(toursOptions);
        console.log("🔍 API Response Received. Mapping data...");

        const allTours = response.data?.data?.experienceTypes || [];

        if (!Array.isArray(allTours) || allTours.length === 0) {
            throw new Error("No tours returned from the API.");
        }

        const imageDictionary = {
            "specialty": "https://images.unsplash.com/photo-1751214608311-c1e01351426c?q=80&w=2159&auto=format&fit=crop",
            "art museums": "https://images.unsplash.com/photo-1761984752674-70f1dcb24daa?w=600&auto=format&fit=crop&q=60",
            "shopping tours": "https://images.unsplash.com/photo-1728325444513-f6f7bdd0950a?w=600&auto=format&fit=crop&q=60",
            "churches & cathedrals": "https://images.unsplash.com/photo-1761654683364-4f8d499a99c0?w=600&auto=format&fit=crop&q=60",
            "holiday & seasonal tours": "https://images.unsplash.com/photo-1668151133903-72da87fe1f40?w=600&auto=format&fit=crop&q=60",
            "art classes": "https://plus.unsplash.com/premium_photo-1704974610818-f8144dcf9549?w=600&auto=format&fit=crop&q=60",
            "historic sites": "https://images.unsplash.com/photo-1640281689804-0ccb69ff6d77?w=600&auto=format&fit=crop&q=60",
            "tuk tuk": "https://images.unsplash.com/photo-1620619523274-1296cb347cb5?q=80&w=600&auto=format&fit=crop",
            "walking": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop",
            "sacred": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600&auto=format&fit=crop",
            "religious": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600&auto=format&fit=crop",
            "food": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop",
            "dining": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop",
            "architectur": "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600&auto=format&fit=crop",
            "photo": "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=600&auto=format&fit=crop",
            "art": "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=600&auto=format&fit=crop",
            "histor": "https://images.unsplash.com/photo-1596422846543-73c1d4eebe28?q=80&w=600&auto=format&fit=crop",
            "shopping": "https://images.unsplash.com/photo-1555529733-0e670560f4e1?q=80&w=600&auto=format&fit=crop",
            "market": "https://images.unsplash.com/photo-1555529733-0e670560f4e1?q=80&w=600&auto=format&fit=crop",
            "rail": "https://images.unsplash.com/photo-1532153258591-6b219b16892c?q=80&w=600&auto=format&fit=crop",
            "bus": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop",
            "park": "https://images.unsplash.com/photo-1508873760731-9c3d0bb6b961?q=80&w=600&auto=format&fit=crop",
            "nature": "https://images.unsplash.com/photo-1508873760731-9c3d0bb6b961?q=80&w=600&auto=format&fit=crop",
            "water": "https://images.unsplash.com/photo-1522067716155-25e407987e91?q=80&w=600&auto=format&fit=crop",
            "cook": "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?q=80&w=600&auto=format&fit=crop",
            "museum": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&auto=format&fit=crop",
            "sport": "https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=600&auto=format&fit=crop"
        };

        const fallbackImages = [
            "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1627308595171-d1ad7a475ab5?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop"
        ];

        const tours = allTours.map((tour, index) => {
            const lat = 22.5726 + (Math.random() * 0.04 - 0.02);
            const lng = 88.3639 + (Math.random() * 0.04 - 0.02);
            const titleLower = (tour.name || "").toLowerCase();
            let selectedImage = null;

            for (const [keyword, imgUrl] of Object.entries(imageDictionary)) {
                if (titleLower.includes(keyword)) {
                    selectedImage = imgUrl;
                    break;
                }
            }

            if (!selectedImage) {
                selectedImage = fallbackImages[index % fallbackImages.length];
            }

            return {
                title: tour.name || "Kolkata Experience",
                description: `Discover the best ${tour.name} in Kolkata. We found ${tour.count || 0} highly-rated options for you to explore.`,
                image: selectedImage,
                price: "Various Prices",
                rating: "Popular",
                url: tour.url || `https://www.tripadvisor.in/Search?q=${encodeURIComponent(tour.name + " Kolkata")}`,
                location: "Kolkata",
                coordinates: [lat, lng]
            };
        }).reverse();

        tourCache.set(cacheKey, tours);
        console.log(`✅ Saved ${tours.length} tours to cache for 7 days.`);

        return res.render("city-tours", {
            user: req.user,
            tours: tours
        });

    } catch (error) {
        console.error("❌ API Fetch failed:", error.message);
        console.log("🚨 API failed. Serving emergency fallback data.");

        const emergencyTours = [
            {
                title: "Private Full-Day Kolkata City Tour",
                description: "Explore the Victoria Memorial, Howrah Bridge, and local markets with a private guide.",
                image: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600&auto=format&fit=crop",
                price: "₹3500",
                url: "https://www.tripadvisor.in/Search?q=Kolkata",
                rating: "4.8",
                location: "Kolkata",
                coordinates: [22.5448, 88.3426]
            },
            {
                title: "Kolkata Heritage Walking Tour",
                description: "A guided walking tour through the colonial architecture and rich history of Dalhousie Square.",
                image: "https://images.unsplash.com/photo-1596422846543-73c1d4eebe28?q=80&w=600&auto=format&fit=crop",
                price: "₹1200",
                url: "https://www.tripadvisor.in/Search?q=Kolkata",
                rating: "4.9",
                location: "Kolkata",
                coordinates: [22.5726, 88.3639]
            },
            {
                title: "Authentic Bengali Street Food Tasting",
                description: "Taste the best local delicacies, from Kati Rolls to authentic Bengali sweets.",
                image: "https://images.unsplash.com/photo-1627308595171-d1ad7a475ab5?q=80&w=600&auto=format&fit=crop",
                price: "₹1800",
                url: "https://www.tripadvisor.in/Search?q=Kolkata",
                rating: "4.7",
                location: "Kolkata",
                coordinates: [22.5550, 88.3520]
            }
        ];

        tourCache.set(cacheKey, emergencyTours);

        return res.render("city-tours", {
            user: req.user,
            tours: emergencyTours
        });
    }
});

module.exports = router;