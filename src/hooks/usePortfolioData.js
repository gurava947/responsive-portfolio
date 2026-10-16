import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchCompletePortfolioData,
  readCachedPortfolio,
  subscribeToPortfolioChanges,
  writeCachedPortfolio,
} from "../services/portfolioApi";

export function usePortfolioData() {
  const [cached] = useState(readCachedPortfolio);
  const [data, setData] = useState(() => cached?.data || null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!cached);
  const [isStale, setIsStale] = useState(Boolean(cached?.isStale));
  const [requestId, setRequestId] = useState(0);
  const realtimeRefreshTimer = useRef(null);

  const retry = useCallback(() => setRequestId((current) => current + 1), []);

  useEffect(() => {
    let isActive = true;
    let unsubscribe = () => {};
    setIsLoading(true);

    fetchCompletePortfolioData()
      .then((result) => {
        if (!isActive) return;
        writeCachedPortfolio(result);
        setData(result);
        setIsStale(false);
        setError("");
        unsubscribe = subscribeToPortfolioChanges(
          () => {
            window.clearTimeout(realtimeRefreshTimer.current);
            realtimeRefreshTimer.current = window.setTimeout(() => {
              if (isActive) setRequestId((current) => current + 1);
            }, 150);
          },
          (subscriptionError) => {
            if (isActive) setError(subscriptionError.message);
          }
        );
      })
      .catch((requestError) => {
        if (!isActive) return;
        setError(requestError.message || "Unable to load portfolio data.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
      unsubscribe();
      window.clearTimeout(realtimeRefreshTimer.current);
    };
  }, [requestId]);

  return { data, error, isLoading, isStale, retry };
}
