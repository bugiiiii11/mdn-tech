"use client";

import { useEffect, useRef } from "react";

// The accretion-disc scenery, in one place.
//
// It is decorative, auto-playing, and loops forever — which is exactly what
// WCAG 2.2.2 (Pause, Stop, Hide) is about. Rather than bolt a pause button
// onto a background element nobody can see, we honour the visitor's OS
// setting: with "reduce motion" on, the video never plays and the poster frame
// stands in. That also spares the 757 KB download on those sessions.
//
// aria-hidden + pointer-events-none: it is scenery, never content.

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export const BlackholeVideo = ({ className, style }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (query.matches) {
        video.pause();
        video.removeAttribute("autoplay");
      } else if (video.paused) {
        // play() rejects when autoplay is blocked; the poster simply stays.
        void video.play().catch(() => {});
      }
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster="/videos/blackhole-poster.webp"
      aria-hidden="true"
      tabIndex={-1}
      className={className}
      style={style}
    >
      <source src="/videos/blackhole.webm" type="video/webm" />
    </video>
  );
};
