import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCompletePortfolioData, readCachedPortfolio, writeCachedPortfolio } from "./portfolioApi";

describe("local portfolio API", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.sessionStorage.clear();
  });

  it("loads the expanded portfolio from the local endpoint", async () => {
    const data = { projects: Array.from({ length: 23 }, (_, i) => ({ id: `project-${i}` })), certificates: [{}] };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data }) });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchCompletePortfolioData()).resolves.toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith("/api/portfolio", expect.objectContaining({ headers: { Accept: "application/json" } }));
  });

  it("stores and reads local portfolio cache data", () => {
    const data = { projects: [{ id: "responsive-color-palette" }] };
    writeCachedPortfolio(data);
    expect(readCachedPortfolio()?.data).toEqual(data);
  });
});
