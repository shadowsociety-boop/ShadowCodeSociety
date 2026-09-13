import React from 'react';
import { motion } from 'framer-motion';

/* ─── TextReveal ──────────────────────────────────────────────────────────
   Wraps each child in an overflow-hidden container so text slides up
   from below, creating a "growing height" reveal. Best for headings.
   ────────────────────────────────────────────────────────────────────── */

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  className = '',
  as = 'div',
}) => {
  const Tag = as;
  return (
    <Tag className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </Tag>
  );
};

/* ─── FadeIn ──────────────────────────────────────────────────────────────
   Generic fade + slide-up wrapper. Works for paragraphs, cards, buttons,
   images — any content block you want to reveal on scroll.
   ────────────────────────────────────────────────────────────────────── */

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  y = 30,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─── StaggerContainer ────────────────────────────────────────────────────
   Wraps a group of FadeIn children so they animate one after another.
   Each child auto-gets an increasing delay.
   ────────────────────────────────────────────────────────────────────── */

interface StaggerContainerProps {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  stagger = 0.1,
  className = '',
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/* ─── StaggerItem ─────────────────────────────────────────────────────────
   Must be used inside StaggerContainer. Each item fades in with slide-up.
   ────────────────────────────────────────────────────────────────────── */

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  y?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  y = 25,
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
};
