import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY, useTheme } from "./useTheme";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete globalThis.__ENABLE_LOCAL_API_TESTS__;
  window.localStorage.clear();
});

describe("useTheme settings synchronization", () => {
  it("debounces rapid preference changes into one API update", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    });
    vi.stubGlobal("fetch", fetchMock);
    globalThis.__ENABLE_LOCAL_API_TESTS__ = true;
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: "light" }));

    const { result } = renderHook(() => useTheme());
    await act(async () => { await Promise.resolve(); });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.updateSettings({ mode: "dark" });
      result.current.updateSettings({ mode: "light" });
      result.current.updateCardUISettings({ hoverScale: 1.04 });
    });

    await act(async () => { vi.advanceTimersByTime(249); });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(1);
      await Promise.resolve();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe("/api/settings");
    expect(fetchMock.mock.calls[1][1].method).toBe("PATCH");
  });
});
