import { useState, useEffect } from 'react';

export type Viewport = {
  width: number;
  height: number;
}

export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const setSizes = () => {
      if (window.innerWidth !== width) {
        // console.log('width', window.innerWidth);
        setWidth(window.innerWidth);
      }

      if (window.innerHeight !== height) {
        setHeight(window.innerHeight);
      }
    };

    setSizes();
    window.addEventListener('resize', setSizes);
    return () => window.removeEventListener('resize', setSizes);
  }, [width, height]);

  return { width, height };
};
