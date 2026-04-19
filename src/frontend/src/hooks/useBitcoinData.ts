import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Candle, FetchResult, PriceSnapshot } from "../types/bitcoin";

export function useLatestPrice() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PriceSnapshot>({
    queryKey: ["latestPrice"],
    queryFn: async () => {
      if (!actor) return { usd: 0, inr: 0, lastUpdated: BigInt(0) };
      return actor.getLatestPrice();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}

export function useOHLCHistory() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Candle[]>({
    queryKey: ["ohlcHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOHLCHistory();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}

export function useFetchAndUpdate() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<FetchResult>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.fetchAndUpdatePrice();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latestPrice"] });
      queryClient.invalidateQueries({ queryKey: ["ohlcHistory"] });
    },
  });
}
