import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/** Load Framer Motion only with the sections and pages that animate. */
export default function AnimatedContent({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
