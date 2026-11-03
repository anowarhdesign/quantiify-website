import { useEffect, useRef, useState } from 'react';

/**
 * For `.reveal` elements whose className React also changes (e.g. an `on` state): returns a ref and
 * whether it has been seen, so the component can keep the `in` class itself.
 */
export default function useRevealOnce(threshold = .2) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown];
}
