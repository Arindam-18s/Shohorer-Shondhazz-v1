// Curated Kolkata trails. Static data: no database needed.
// Coordinates are approximate (about 100 m). Check them before publishing.
const stops = {
  victoria:   { id: "victoria",   name: "Victoria Memorial",    latitude: 22.5448, longitude: 88.3426, note: "Marble museum and gardens." },
  howrah:     { id: "howrah",     name: "Howrah Bridge",        latitude: 22.5851, longitude: 88.3468, note: "Best at sunrise or dusk." },
  prinsep:    { id: "prinsep",    name: "Prinsep Ghat",         latitude: 22.5545, longitude: 88.3340, note: "Riverside promenade." },
  stpaul:     { id: "stpaul",     name: "St. Paul's Cathedral", latitude: 22.5446, longitude: 88.3470, note: "Indo-Gothic cathedral." },
  indian:     { id: "indian",     name: "Indian Museum",        latitude: 22.5580, longitude: 88.3510, note: "One of India's oldest museums." },
  college:    { id: "college",    name: "College Street",       latitude: 22.5745, longitude: 88.3637, note: "Famous second-hand book market." },
  kumartuli:  { id: "kumartuli",  name: "Kumartuli",            latitude: 22.5938, longitude: 88.3650, note: "Potters' quarter, Durga idols." },
};

const trails = [
  {
    id: "heritage-walk",
    title: "Colonial Heritage Walk",
    summary: "Cathedral, palace gardens and museum in one easy loop.",
    stops: ["stpaulz", "victoria", "indian"],
  },
  {
    id: "river-sunset",
    title: "Hooghly Riverside Sunset",
    summary: "Bridge views and a riverside stroll.",
    stops: ["howrah", "prinsep"],
  },
  {
    id: "north-culture",
    title: "North Kolkata Culture Trail",
    summary: "Books, art and craftsmen in the old city.",
    stops: ["college", "kumartuli"],
  },
];

function getTrails() {
  return trails.map((t) => ({
    id: t.id,
    title: t.title,
    summary: t.summary,
    stops: t.stops.map((sid) => stops[sid]).filter(Boolean),
  }));
}

module.exports = { getTrails };