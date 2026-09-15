import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { mediaUrl } from '../lib/siteContent';

const fallbackBrand = { name: 'Bali Vision Tour', logo: '/logo-icon.png', logoLight: '' };

export const Preloader = ({ loading }) => {
  const { settings } = useSettings();
  const brand = settings?.brand || fallbackBrand;
  const [minDone, setMinDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMinDone(true), 900); return () => clearTimeout(t); }, []);
  const show = loading || !minDone;
  return (
    <AnimatePresence>
      {show && (
        <motion.div key="preloader" className="fixed inset-0 z-[100] bg-forest text-white flex items-center justify-center grain" exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }} data-testid="preloader">
          <div className="relative z-10 flex flex-col items-center">
            <motion.img src={mediaUrl(brand.logoLight || brand.logo)} alt={brand.name} data-testid="preloader-logo" className="w-32 h-16 object-contain" initial={{ scale: 0.6, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
            <div className="overflow-hidden mt-5">
              <motion.div className="font-display font-bold text-2xl tracking-tight" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} data-testid="preloader-brand">{brand.name}</motion.div>
            </div>
            <motion.div className="h-px bg-white/30 mt-5 w-40 overflow-hidden"><motion.div className="h-full bg-brand" initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ duration: 0.9, ease: 'easeInOut' }} /></motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
