"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const wakeLock = useRef<any>(null);

  const requestLock = useCallback(async () => {
    if ("wakeLock" in navigator) {
      try {
        wakeLock.current = await (navigator as any).wakeLock.request("screen");
        wakeLock.current.addEventListener("release", () => {
          setIsLocked(false);
          // console.log('Wake Lock released');
        });
        setIsLocked(true);
        // console.log('Wake Lock active');
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (wakeLock.current) {
      try {
        await wakeLock.current.release();
        wakeLock.current = null;
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  }, []);

  // Re-acquire lock if visibility changes (e.g. user tabs away and back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wakeLock.current !== null && document.visibilityState === "visible") {
        requestLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [requestLock]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      releaseLock();
    };
  }, [releaseLock]);

  return { isLocked, requestLock, releaseLock };
}
