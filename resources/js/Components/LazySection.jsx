import React, { useState, useEffect, useRef } from 'react';

const LazySection = ({ children, height = '200px' }) => {
  const [isRendered, setIsRendered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!('IntersectionObserver' in window)) {
      setIsRendered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRendered(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' } // Load 300px before it enters the viewport
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={!isRendered ? { minHeight: height } : {}}>
      {isRendered ? children : null}
    </div>
  );
};

export default LazySection;
