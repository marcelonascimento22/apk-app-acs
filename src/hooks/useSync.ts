import { useCallback, useEffect, useState } from "react";
import { SyncService } from "../services/sync.service";

export function useSync() {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [pendingItems, setPendingItems] = useState(0);

  const loadStatus = useCallback(async () => {
    try {
      const status = await SyncService.getStatus();

      setLastSync(status.lastSync);
      setPendingItems(status.pendingItems);
    } catch (error) {
      console.error("Erro ao carregar status:", error);
    }
  }, []);

  const syncNow = useCallback(async () => {
    try {
      setLoading(true);

      await SyncService.sync();

      await loadStatus();
    } catch (error) {
      console.error("Erro na sincronização:", error);
    } finally {
      setLoading(false);
    }
  }, [loadStatus]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  return {
    loading,
    lastSync,
    pendingItems,
    syncNow,
    refreshStatus: loadStatus,
  };
}