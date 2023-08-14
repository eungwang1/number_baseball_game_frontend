import { useState, useEffect, useRef, useCallback } from 'react';

type UseInfinityScrollProps = {
  loadMore: () => Promise<void>;
  hasMore: boolean;
};

function useInfinityScroll({ loadMore, hasMore }: UseInfinityScrollProps) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    await loadMore();
    setIsLoading(false);
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      {
        rootMargin: '30px',
        threshold: 1.0, //
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }
    return () => {
      if (observerRef.current && loadingRef.current) {
        observerRef.current.unobserve(loadingRef.current);
      }
    };
  }, [loadMoreItems]);

  return { isLoading, loadingRef };
}

export default useInfinityScroll;
