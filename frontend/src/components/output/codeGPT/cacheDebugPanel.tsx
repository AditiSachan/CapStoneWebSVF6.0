import React, { useState, useEffect } from 'react';
import CacheService, { CacheStats, CacheEntry } from '../../services/cacheService';
import styles from './cacheDebugPanel.module.css';

interface CacheDebugPanelProps {
  sessionId?: string;
  isVisible: boolean;
  onToggle: () => void;
}

const CacheDebugPanel: React.FC<CacheDebugPanelProps> = ({
  sessionId,
  isVisible,
  onToggle,
}) => {
  const [stats, setStats] = useState<CacheStats>({ totalEntries: 0, hitRate: 0, totalHits: 0, totalMisses: 0 });
  const [sessionEntries, setSessionEntries] = useState<CacheEntry[]>([]);
  const cacheService = CacheService.getInstance();

  const refreshData = () => {
    setStats(cacheService.getCacheStats());
    if (sessionId) {
      setSessionEntries(cacheService.getSessionCacheEntries(sessionId));
    }
  };

  useEffect(() => {
    if (isVisible) {
      refreshData();
      // Refresh every 5 seconds when panel is visible
      const interval = setInterval(refreshData, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, sessionId]);

  const handleClearSessionCache = () => {
    if (sessionId && confirm('Clear cache for this session?')) {
      cacheService.clearSessionCache(sessionId);
      refreshData();
    }
  };

  const handleClearAllCache = () => {
    if (confirm('Clear all cache data?')) {
      cacheService.clearAllCache();
      refreshData();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!isVisible) {
    return (
      <button className={styles.toggleButton} onClick={onToggle}>
        Show Cache Debug
      </button>
    );
  }

  return (
    <div className={styles.debugPanel}>
      <div className={styles.header}>
        <h3>Cache Debug Panel</h3>
        <button className={styles.toggleButton} onClick={onToggle}>
          Hide
        </button>
      </div>

      <div className={styles.stats}>
        <h4>Cache Statistics</h4>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Entries:</span>
            <span className={styles.statValue}>{stats.totalEntries}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Hit Rate:</span>
            <span className={styles.statValue}>{stats.hitRate.toFixed(1)}%</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Hits:</span>
            <span className={styles.statValue}>{stats.totalHits}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Misses:</span>
            <span className={styles.statValue}>{stats.totalMisses}</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={refreshData} className={styles.actionButton}>
          Refresh
        </button>
        {sessionId && (
          <button onClick={handleClearSessionCache} className={styles.actionButton}>
            Clear Session Cache
          </button>
        )}
        <button onClick={handleClearAllCache} className={styles.actionButton}>
          Clear All Cache
        </button>
      </div>

      {sessionId && (
        <div className={styles.sessionEntries}>
          <h4>Session Cache Entries ({sessionEntries.length})</h4>
          <div className={styles.entriesList}>
            {sessionEntries.length === 0 ? (
              <p className={styles.noEntries}>No cached entries for this session</p>
            ) : (
              sessionEntries.map((entry, index) => (
                <div key={index} className={styles.entryItem}>
                  <div className={styles.entryHeader}>
                    <span className={styles.entryTimestamp}>
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  <div className={styles.entryQuestion}>
                    <strong>Q:</strong> {truncateText(entry.question)}
                  </div>
                  <div className={styles.entryAnswer}>
                    <strong>A:</strong> {truncateText(entry.answer)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheDebugPanel;