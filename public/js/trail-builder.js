// Draws trails on a Leaflet map using OSRM routing from the browser.
// No server or database calls are made for routing.
(function () {
  const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving/";
  const TIMEOUT_MS = 8000;
  const routeCache = new Map(); // trailId -> { geometry, distance, duration, approximate }

  function buildUrl(stops) {
    const coords = stops.map((s) => `${s.longitude},${s.latitude}`).join(";");
    return `${OSRM_BASE}${coords}?overview=full&geometries=geojson`;
  }

  async function fetchOsrm(stops) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(buildUrl(stops), { signal: ctrl.signal });
      if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`);
      const data = await res.json();
      const r = data.routes && data.routes[0];
      if (!r) throw new Error(`OSRM: ${data.code || "no route"}`);
      return {
        latlngs: r.geometry.coordinates.map((c) => [c[1], c[0]]),
        distance: r.distance,
        duration: r.duration,
        approximate: false,
      };
    } finally {
      clearTimeout(timer);
    }
  }

  // Straight lines between stops, used only if OSRM is unreachable.
  function straightLine(stops) {
    return {
      latlngs: stops.map((s) => [s.latitude, s.longitude]),
      distance: null,
      duration: null,
      approximate: true,
    };
  }

  async function getRoute(trail) {
    if (routeCache.has(trail.id)) return routeCache.get(trail.id);
    let result;
    try {
      result = await fetchOsrm(trail.stops);
    } catch (err) {
      console.warn("[trail-builder] routing unavailable, using straight lines:", err.message);
      result = straightLine(trail.stops);
    }
    routeCache.set(trail.id, result);
    return result;
  }

  function fmtDistance(m) {
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
  }
  function fmtDuration(s) {
    const mins = Math.round(s / 60);
    return mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;
  }

  window.initTrailBuilder = async function (mapId, listId, infoId) {
    if (!window.L) return console.error("[trail-builder] Leaflet not loaded");

    const map = L.map(mapId).setView([22.57, 88.36], 14);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const listEl = document.getElementById(listId);
    const infoEl = document.getElementById(infoId);
    let layer = L.layerGroup().addTo(map);

    let trails = [];
    try {
      const res = await fetch("/our-top-picks/trails");
      trails = await res.json();
    } catch (err) {
      infoEl.textContent = "Could not load trails. Please refresh.";
      return;
    }

    async function show(trail, button) {
      listEl.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      layer.clearLayers();
      infoEl.textContent = "Drawing route...";

      const route = await getRoute(trail);
      const line = L.polyline(route.latlngs, {
        color: "#0066ff",
        weight: 4,
        opacity: 0.85,
        dashArray: route.approximate ? "8 8" : null,
      }).addTo(layer);

      trail.stops.forEach((s, i) => {
        L.circleMarker([s.latitude, s.longitude], {
          radius: 8, color: "#fff", weight: 2, fillColor: "#0066ff", fillOpacity: 1,
        })
          .bindPopup(() => {
            const wrap = document.createElement("div");
            const strong = document.createElement("strong");
            strong.textContent = `${i + 1}. ${s.name}`;
            const note = document.createElement("p");
            note.className = "mb-0 small";
            note.textContent = s.note || "";
            wrap.append(strong, note);
            return wrap;
          })
          .addTo(layer);
      });

      map.fitBounds(line.getBounds(), { padding: [30, 30] });

      const parts = [];
      if (route.distance) parts.push(fmtDistance(route.distance));
      if (route.duration) parts.push(`about ${fmtDuration(route.duration)} by road`);
      if (route.approximate) parts.push("straight-line preview (routing unavailable)");
      infoEl.textContent = `${trail.title}: ${trail.summary}${parts.length ? " | " + parts.join(", ") : ""}`;
    }

    trails.forEach((trail) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-outline-primary btn-sm me-2 mb-2";
      btn.textContent = trail.title;
      btn.addEventListener("click", () => show(trail, btn));
      listEl.appendChild(btn);
    });

    if (trails.length) show(trails[0], listEl.querySelector("button"));
  };
})();