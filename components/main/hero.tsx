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
        className="rotate-180 absolute top-[-355px] md:top-[-340px] left-1/2 -translate-x-1/2 w-[350%] md:w-full md:left-0 md:translate-x-0 h-full object-contain -z-10 pointer-events-none"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      <HeroContent />
    </div>
  );
};
