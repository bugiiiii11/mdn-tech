"use client";

import type { PropsWithChildren } from "react";
import { MotionConfig } from "framer-motion";

// Wraps the marketing tree so every framer-motion animation honours the
// visitor's OS "reduce motion" setting. reducedMotion="user" makes framer skip
// transform and layout animations (opacity still crossfades) without each
// component having to opt in — and, critically, without any reveal leaving
// content stuck at opacity: 0.
export const ReducedMotionProvider = ({ children }: PropsWithChildren) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
