import { useEffect } from 'react';

/**
 * Locks background page scroll while a fixed-position overlay (modal/drawer)
 * is mounted, so scroll gestures over the overlay don't leak through to the
 * page behind it. Restores the previous overflow value on unlock/unmount.
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}
