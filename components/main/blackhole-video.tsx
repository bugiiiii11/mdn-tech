"use client";

import { useEffect, useRef, useState } from "react";

// The accretion-disc scenery, in one place.
//
// It is decorative, auto-playing, and loops forever — which is exactly what
// WCAG 2.2.2 (Pause, Stop, Hide) is about. Rather than bolt a pause button
// onto a background element nobody can see, we honour the visitor's OS
// setting: with "reduce motion" on, the video never plays and the poster frame
// stands in. That also spares the 757 KB download on those sessions.
//
// aria-hidden + pointer-events-none: it is scenery, never content.
//
// `lazy`: autoplay overrides preload="none", so every mounted instance fetches
// the full file immediately. Pages mount this twice (hero + footer bookend),
// which doubled the 740 KB download on first paint. The below-fold instance
// passes `lazy` and shows the poster alone until it nears the viewport; by the
// time the video mounts, the hero's fetch has the file in HTTP cache.

// Hero framing constants live in components/main/hero-shell.ts — this file stays
// the video element alone.

type Props = {
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
};

export const BlackholeVideo = ({ className, style, lazy = false }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(!lazy);

  useEffect(() => {
    if (ready) return;
    const poster = posterRef.current;
    if (!poster || !("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setReady(true);
      },
      { rootMargin: "1000px 0px" },
    );
    observer.observe(poster);
    return () => observer.disconnect();
  }, [ready]);

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
  }, [ready]);

  if (!ready) {
    return (
      // Raw <img>, not next/image: it must be the SAME URL as the <video>
      // poster attribute so the browser caches one file — an optimized copy
      // would be a second download of a frame the video ships anyway.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={posterRef}
        src="/videos/blackhole-poster.webp"
        alt=""
        aria-hidden="true"
        className={className}
        style={style}
      />
    );
  }

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
