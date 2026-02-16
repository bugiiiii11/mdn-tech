"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";

export const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row h-[650px] items-center justify-center px-20 mt-40 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col items-center gap-5 justify-center m-auto text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]]"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">
            UAE-Based • Global Reach • Enterprise Solutions
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-5xl md:text-6xl lg:text-7xl text-bold text-white w-auto h-auto"
        >
          <span className="text-center">
            <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-purple-500 to-cyan-500">
              Build Digital
            </span>
            <br />
            <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-cyan-500 to-purple-500">
              Excellence
            </span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-xl md:text-2xl text-gray-300 my-5 max-w-[700px] text-center font-medium"
        >
          Transforming ideas into scalable, production-ready systems
        </motion.p>

        <motion.p
          variants={slideInFromLeft(0.9)}
          className="text-base md:text-lg text-gray-400 my-2 max-w-[700px] text-center leading-relaxed"
        >
          AI-powered solutions • Blockchain systems • Enterprise architecture • Mobile experiences
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-col sm:flex-row gap-4 mt-8 items-center justify-center"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#about-us"
            className="py-3 px-8 border border-[#7042f88b] text-center text-white cursor-pointer rounded-lg font-semibold hover:bg-[#7042f815] transition-all duration-300"
          >
            Learn More
          </motion.a>
        </motion.div>
      </div>

      {/* <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center"
      >
        <Image
          src="/hero-bg.svg"
          alt="work icons"
          height={650}
          width={650}
          draggable={false}
          className="select-none"
        />
      </motion.div> */}
    </motion.div>
  );
};
