export const MOTION = {
  instant: 0.12,
  micro: 0.18,
  fast: 0.25,
  standard: 0.35,
  smooth: 0.5,
  premium: 0.7,
  cinematic: 0.9,
};

export const EASING = {
  primary: [0.16, 1, 0.3, 1], // Apple-like smooth ease-out
  secondary: [0.22, 1, 0.36, 1],
  smooth: [0.4, 0, 0.2, 1],
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 28,
  },
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 15, // For cart badges and micro-interactions
  }
};
