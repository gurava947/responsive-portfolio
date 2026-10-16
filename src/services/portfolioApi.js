const CACHE_KEY = "practicefolio.local-portfolio.v2";
const CACHE_TTL = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15000;
let completeRequest;

export async function fetchCompletePortfolioData() {
  if (completeRequest) return completeRequest;
  completeRequest = (async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const endpoint = import.meta.env.MODE === "vercel" ? "/portfolio-data.json" : "/api/portfolio";
      const response = await fetch(endpoint, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Portfolio data endpoint returned HTTP ${response.status}.`);
      const payload = await response.json();
      const data = payload?.data;
      if (!data || !Array.isArray(data.projects) || data.projects.length === 0 || !Array.isArray(data.certificates)) {
        throw new Error("Portfolio data did not include project and certificate records.");
      }
      return data;
    } catch (error) {
      if (controller.signal.aborted) throw new Error("Portfolio data request timed out.");
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  })().finally(() => { completeRequest = null; });
  return completeRequest;
}

export function readCachedPortfolio() {
  try {
    const cached = window.sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (!parsed || !Number.isFinite(parsed.savedAt) || !parsed.data) return null;
    return { data: parsed.data, isStale: Date.now() - parsed.savedAt > CACHE_TTL };
  } catch (error) {
    console.warn("Unable to read the cached local portfolio data.", error);
    return null;
  }
}

export function writeCachedPortfolio(data) {
  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch (error) {
    console.warn("Unable to cache the local portfolio data in this browser session.", error);
  }
}

export function subscribeToPortfolioChanges() {
  return () => {};
}
