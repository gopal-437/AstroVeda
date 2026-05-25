/**
 * Get client geolocation details using ipapi.co
 * Caches location in sessionStorage to avoid hitting rate limits on page transition/re-renders
 */
export async function getGeoLocation() {
  if (typeof window === "undefined") return null;

  // Try to retrieve cached location
  const cached = sessionStorage.getItem("astro_geo_location");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Clear invalid cache
      sessionStorage.removeItem("astro_geo_location");
    }
  }

  try {
    // 3-second timeout to prevent stalling page load
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country_name) {
        const geo = {
          country: data.country_name,
          city: data.city || "Unknown City",
          ip: data.ip || "Unknown IP"
        };
        sessionStorage.setItem("astro_geo_location", JSON.stringify(geo));
        return geo;
      }
    }
  } catch (error) {
    console.warn("Client-side geo-lookup error (normal on local network/adblocks):", error.message);
  }

  return null;
}

/**
 * Tracks site and module interaction events
 * @param {string} eventType - "page_view" | "module_view"
 * @param {string|null} moduleName - Name of the section (e.g. "palm", "compatibility")
 */
export async function trackEvent(eventType, moduleName = null) {
  try {
    const geo = await getGeoLocation();
    
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        eventType,
        moduleName,
        country: geo?.country || "Unknown Country",
        city: geo?.city || "Unknown City",
        ip: geo?.ip || "Unknown IP"
      })
    });
  } catch (err) {
    console.error("Analytics tracking failure:", err);
  }
}
