import { HeroContent } from "@/components/sub/hero-content";

export const Hero = () => {
  return (
    <div id="home" className="relative flex flex-col h-full w-full max-w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        preload="auto"
        playsInline
        className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-contain z-0 max-w-full pointer-events-none mix-blend-screen"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      <HeroContent />
    </div>
  );
};
