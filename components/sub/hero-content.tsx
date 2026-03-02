"use client";

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
      className="flex flex-row h-[650px] items-center justify-center px-4 md:px-20 mt-40 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col items-center gap-5 justify-center m-auto text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]] invisible"
        >
          <h1 className="Welcome-text text-[13px]">
            UAE-Based · AI-Powered Development · Global Delivery
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-5xl md:text-6xl lg:text-7xl text-bold text-white w-auto h-auto"
        >
          <span className="text-center">
            <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-purple-500 to-cyan-500">
              Build Smarter.

            </span>
            <br />
            <span className="text-transparent bg-clip-text font-bold bg-gradient-to-r from-cyan-500 to-purple-500">
              Ship Faster.
            </span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-xl md:text-2xl text-gray-300 my-5 max-w-[700px] text-center font-medium"
        >
          From idea to production-ready AI systems — faster, smarter, and more secure than traditional development
        </motion.p>

        <motion.p
          variants={slideInFromLeft(0.9)}
          className="text-base md:text-lg text-gray-400 my-2 max-w-[700px] text-center leading-relaxed"
        >
          We are a team of full-stack AI engineers who build complex products using the latest AI models, autonomous agents, and modern engineering practices.
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-col sm:flex-row gap-4 mt-8 items-center justify-center"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact-us"
            className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
          >
            Start Your Project
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#process"
            className="py-3 px-8 button-primary text-center text-white cursor-pointer rounded-lg font-semibold"
          >
            See How We Build
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
