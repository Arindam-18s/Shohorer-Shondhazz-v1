```
# 🌆 City Discovery & Local Explorer

A full-stack local city discovery platform that helps users discover nearby businesses, explore what's happening around the city, find curated places, explore city tours, and interact with an AI-powered city assistant.

The platform combines location-based discovery, user-generated content, curated recommendations, interactive maps, and AI assistance into a single web application.

---

## ✨ Features

### 🗺️ Interactive City Discovery

- Explore local businesses through an interactive Leaflet map.
- View businesses based on their location.
- Store and display latitude and longitude information.
- Discover restaurants, cafés, shops, gyms, events, and other local places.
- Location-based discovery architecture for future geospatial search.

### 🏪 Local Business Discovery

Businesses can be listed with:

- Business name
- Business type
- Description
- Special offers
- Location
- Latitude and longitude
- Business image

Users can browse businesses and discover places based on their interests and location.

---

### 👀 What's Happening Right Now

A user-generated local activity feed where users can share:

- Posts
- Images
- Locations
- Descriptions
- Recent activities

The homepage displays the latest posts to give users a real-time feel of what's happening around the city.

Posts are retrieved from MongoDB and sorted by creation time.

---

### 🔥 Our Top Picks

A curated section containing recommended places around the city.

Features include:

- Image carousels
- Place descriptions
- Ratings
- Categories
- Recommendations
- Save functionality

Bootstrap cards and carousels are used to create a responsive discovery experience.

---

### 🧭 City Tours

The platform provides curated city exploration plans such as:

- 🍛 Food tours
- 🔥 Heritage walks
- 🌆 City-light tours
- 🌿 Relaxed neighbourhood tours

Each tour can contain:

- Title
- Description
- Price
- Currency
- Duration
- Rating
- Review count
- Category
- Group size
- Image
- Tour URL

The application also exposes tour data through an API endpoint:

```text
GET /api/tours
````

---

## 🤖 AI City Discovery Assistant

The application includes an AI-powered chatbot designed specifically for local city discovery.

Users can ask questions such as:

> "What can I do in North Kolkata this evening?"

> "Where can I find Bengali food near College Street?"

> "What is happening around Kumartuli?"

> "Plan a 4-hour evening in North Kolkata."

The assistant is designed to provide:

* City recommendations
* Itineraries
* Local activity suggestions
* Business recommendations
* Tour suggestions
* Location-based information

---

## 🧠 AI Architecture

The chatbot was initially implemented using the Gemini API and later designed to support local LLM inference through Ollama.

### Current architecture

```text
User
  ↓
Chatbot UI
  ↓
Express API
  ↓
AI Model
  ↓
Response
  ↓
Chatbot UI
```

For database-aware responses, the architecture can be extended to:

```text
                    ┌───────────────┐
                    │   MongoDB     │
                    └───────┬───────┘
                            │
                            ↓
User → Chatbot → AI → Database Tools
                     ↓
                Query Results
                     ↓
                    AI
                     ↓
              Final Response
```

This allows the AI to retrieve actual information from the application's database instead of relying entirely on its pretrained knowledge.

---

## 🧩 Database-Aware AI

The application is designed to allow the AI assistant to access application data through controlled backend functions.

Potential tools include:

```text
search_businesses()
get_business_details()
search_events()
get_latest_posts()
search_city_tours()
get_top_picks()
search_nearby_businesses()
get_business_offers()
```

This architecture prevents the AI model from directly accessing the database.

Instead:

```text
AI
 ↓
Requests a tool
 ↓
Express executes the function
 ↓
MongoDB query
 ↓
Results returned to AI
 ↓
AI generates response
```

This approach reduces hallucinated recommendations and allows responses to reflect the actual content available on the platform.

---

# 📍 Location & Maps

The application uses **Leaflet** for interactive maps.

Leaflet is used for:

* Displaying city locations
* Showing businesses
* Selecting locations
* Capturing latitude/longitude
* Supporting future nearby-business discovery

A typical location flow is:

```text
User selects location on map
          ↓
Leaflet
          ↓
Latitude + Longitude
          ↓
Express
          ↓
MongoDB
```

The project can later use MongoDB geospatial queries such as `$near` to retrieve businesses within a specific radius.

---

# 👤 User Features

Users can:

* Register
* Log in
* Browse local businesses
* Explore city recommendations
* View user posts
* Create posts
* Upload images
* Select locations using Leaflet
* Explore city tours
* Interact with the AI assistant
* Save recommended places

---

# 🏢 Business Features

Businesses can provide:

* Business information
* Business type
* Description
* Special offers
* Location
* Images
* Events and upcoming activities

The architecture separates normal users from business accounts using roles.

Example:

```js
role: {
    type: String,
    enum: ["USER", "BUSINESS"]
}
```

---

# 📸 Image Uploads

User-generated content supports image uploads using **Multer**.

Uploaded images are stored under:

```text
/public/uploads/
```

For example:

```text
public/
└── uploads/
    └── user-posts/
        ├── image1.jpg
        ├── image2.jpg
        └── image3.jpg
```

Images can then be served through Express static middleware.

---

# 🔐 Authentication

Authentication is handled through cookies and middleware.

The application uses an authentication cookie:

```text
token
```

Authentication middleware checks the token before allowing access to protected functionality.

The general flow is:

```text
Login
 ↓
Generate authentication token
 ↓
Store token in cookie
 ↓
Authentication middleware
 ↓
Identify user
 ↓
Protected route
```

---

# 🗄️ Database

The application uses **MongoDB** as its primary database.

MongoDB stores information such as:

* Users
* Businesses
* User posts
* Locations
* Offers
* Tours
* Events
* Other discovery-related data

MongoDB is accessed through **Mongoose**.

---

# 🏗️ Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* EJS
* Bootstrap
* Leaflet
* Emoji Picker

## Backend

* Node.js
* Express.js
* REST APIs
* Cookie-based authentication
* Multer

## Database

* MongoDB
* Mongoose

## AI

* Google Gemini API
* Ollama
* Llama 3.2

## Maps

* Leaflet
* OpenStreetMap-compatible map layers

---

# 📁 Project Structure

A typical structure is:

```text
project/
│
├── controllers/
│
├── middleware/
│
├── models/
│   ├── user.js
│   ├── business.js
│   ├── userPosts.js
│   └── ...
│
├── routes/
│   ├── users.js
│   ├── businesses.js
│   ├── user-posts.js
│   ├── city-tours.js
│   ├── chatbot.js
│   └── ...
│
├── services/
│
├── utils/
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
│       └── user-posts/
│
├── views/
│   ├── index.ejs
│   ├── businesses.ejs
│   ├── city-tours.ejs
│   ├── happening-now.ejs
│   └── ...
│
├── .env
├── index.js
├── package.json
└── README.md
```

---

# 🔄 Application Flow

```text
                    CITY DISCOVERY PLATFORM
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ↓                ↓                ↓
        Businesses       User Posts       City Tours
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                          MongoDB
                              │
                              ↓
                         Express API
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
           EJS UI          Leaflet          AI
                              │               │
                              └───────┬───────┘
                                      ↓
                              City Assistant
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

Move into the project:

```bash
cd <project-folder>
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env` to GitHub.

Add it to `.gitignore`:

```text
.env
node_modules/
```

---

## 4. Start MongoDB

Make sure your MongoDB server is running.

---

## 5. Start the application

```bash
npm start
```

or, if using nodemon:

```bash
npm run dev
```

The application should then be available at:

```text
http://localhost:3000
```

---

# 🔌 Important API Routes

### Authentication

```text
POST /users/signin
POST /users/signup
GET  /users/logout
```

### Businesses

```text
GET  /businesses
POST /businesses
```

### User Posts

```text
POST /user-posts
GET  /user-posts/happening-now
```

### City Tours

```text
GET /city-tours
GET /api/tours
```

### AI Chatbot

```text
POST /chatbot/message
```

---

# 🤖 Chatbot Request Flow

The chatbot sends conversation history to the backend.

Example:

```json
{
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "text": "What should I do in North Kolkata?"
                }
            ]
        }
    ]
}
```

The Express backend forwards the request to the AI model.

The response is then returned to the frontend.

---

# 🧠 AI Context Strategy

The chatbot can use multiple layers of context.

### Layer 1 — Conversation Context

Previous messages in the current conversation.

```text
User:
I want food.

AI:
What type?

User:
Bengali.

AI:
...
```

### Layer 2 — Application Context

Information stored in MongoDB:

```text
Businesses
Posts
Tours
Events
Offers
```

### Layer 3 — Location Context

Information from Leaflet:

```text
Latitude
Longitude
Nearby businesses
```

### Layer 4 — External Knowledge

AI-generated or externally retrieved information when the application database does not contain the required information.

---

# 🎯 Example Use Cases

### Discover places

```text
"Find me a café near College Street."
```

### Explore activities

```text
"What is happening around Kumartuli?"
```

### Create itineraries

```text
"Create a 5-hour evening plan around North Kolkata."
```

### Find offers

```text
"Are there any offers available nearby?"
```

### Discover tours

```text
"Show me food-focused city tours."
```

---

# 📊 Future Improvements

The project can be extended with:

### 🔎 Advanced Search

* Full-text search
* Category filters
* Price filters
* Rating filters
* Distance filters

### 📍 Geospatial Search

Use MongoDB geospatial indexes:

```text
User location
     ↓
MongoDB $near
     ↓
Businesses within radius
```

### 🤖 AI Function Calling

Allow the AI to dynamically call:

```text
search_businesses
search_events
search_tours
search_posts
search_nearby
```

### 🧠 RAG

For large amounts of unstructured city information:

```text
City information
       ↓
Embeddings
       ↓
Vector database
       ↓
Semantic retrieval
       ↓
AI
```

### 📱 Responsive UI

Improve mobile-first support for:

* Maps
* Business cards
* Chatbot
* Discovery feed
* City tours

### ⭐ Reviews & Ratings

Add:

* User reviews
* Ratings
* Likes
* Comments
* Impressions

---

# 🛡️ Security Considerations

The application should:

* Keep API keys in environment variables.
* Never expose API keys in frontend JavaScript.
* Validate uploaded files.
* Limit upload sizes.
* Validate user input.
* Protect authenticated routes.
* Sanitize user-generated content.
* Restrict AI database tools to safe operations.
* Avoid exposing sensitive user information to AI models.

---

# 🚀 Why This Project?

Traditional city discovery applications usually separate:

* Maps
* Business listings
* Events
* Social feeds
* Travel recommendations

This project attempts to combine these experiences into one platform.

Instead of simply browsing listings, users can interact with the application conversationally and discover places based on:

```text
Location
+
Interests
+
Current activity
+
Business information
+
Tours
+
AI recommendations
```

---

# 🧑‍💻 Learning Outcomes

This project demonstrates practical experience with:

* Full-stack web development
* REST API development
* MVC-style application architecture
* MongoDB database design
* Mongoose ODM
* Authentication
* File uploads
* Dynamic EJS rendering
* Bootstrap responsive UI
* Interactive maps
* Geolocation concepts
* AI API integration
* Local LLM integration
* Database-aware AI architecture
* API design
* Asynchronous JavaScript
* Backend middleware

---

# 🔮 Future Vision

The long-term goal is to evolve the platform into an intelligent local discovery assistant.

Instead of simply asking:

> "Where should I go?"

users could say:

> "I have ₹1500, I'm near College Street, I like Bengali food and old architecture, and I have four hours."

The system could combine:

```text
User preferences
       +
Current location
       +
Business database
       +
Events
       +
Tours
       +
Offers
       +
AI reasoning
       ↓
Personalized city experience
```

---

## 👨‍💻 Author

**Your Name**

Built as a full-stack project exploring local discovery, geospatial applications, AI assistants, and modern web application architecture.

---

## ⭐ Project Highlights

```text
MongoDB        → Persistent application data
Express.js     → Backend APIs & routing
Node.js        → Server-side runtime
EJS            → Dynamic server-rendered UI
Bootstrap      → Responsive interface
Leaflet        → Interactive maps
Multer         → Image uploads
Gemini/Ollama  → AI assistant
Mongoose       → MongoDB integration
```

---

## 📌 Status

🚧 **Active Development**

The core local discovery, business listing, user-post, city-tour, map, and AI chatbot functionality is being developed incrementally.

```

### For your GitHub specifically

I would **not** call this a "basic local business discovery website" in the README. The stronger positioning is:

> **AI-powered local city discovery platform combining location-based business discovery, user-generated activity feeds, curated city tours, interactive maps, and a database-aware AI assistant.**

That accurately reflects what you've actually built and gives the project much more weight when a recruiter scans the repository.
```
