import React from 'react';
import { motion } from 'framer-motion';

export const Reveal = ({ children, delay = 0, y = 28, className = '', once = true, ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const Stagger = ({ children, className = '', delayChildren = 0.08 }) => (
  <motion.div
    className={className}
    initial={false}
    animate="show"
    variants={{ hidden: {}, show: { transition: { staggerChildren: delayChildren } } }}
  >
    {children}
  </motion.div>
);

export const Item = ({ children, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
  >
    {children}
  </motion.div>
);

export default Reveal;
