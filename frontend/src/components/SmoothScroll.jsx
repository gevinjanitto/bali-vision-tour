import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis = null;

export const SmoothScroll = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenis = null; };
  }, []);
  useEffect(() => { lenis?.scrollTo(0, { immediate: true }); window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export default SmoothScroll;
