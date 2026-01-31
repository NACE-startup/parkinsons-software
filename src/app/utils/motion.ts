/**
 * Motion utilities for premium, smooth animations
 * Following iOS-style spring easing patterns
 */

export const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export const pageTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  duration: 0.32,
};

export const fastSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 32,
  duration: 0.12,
};

export const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
};

export const slideUp = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
  transition: pageTransition,
};

export const scaleButton = {
  whileTap: { scale: 0.98 },
  transition: fastSpring,
};

export const scaleIcon = {
  whileTap: { scale: 1.08 },
  transition: fastSpring,
};
