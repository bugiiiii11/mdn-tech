"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import {
  RxLinkedinLogo,
  RxGithubLogo,
  RxTwitterLogo,
  RxInstagramLogo
} from "react-icons/rx";
import { slideInFromTop, slideInFromLeft, slideInFromRight } from "@/lib/motion";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      label: "Email",
      value: "contact@mdntech.org",
      link: "mailto:contact@mdntech.org",
    },
    {
      icon: PhoneIcon,
      label: "Phone",
      value: "+971 58 228 3256",
      link: "tel:+971582283256",
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: "United Arab Emirates",
      link: "#",
    },
  ];

  const socialLinks = [
    { icon: RxLinkedinLogo, link: "https://www.linkedin.com/company/mdntech/", label: "LinkedIn" },
    { icon: RxGithubLogo, link: "https://github.com", label: "GitHub" },
    { icon: RxTwitterLogo, link: "https://x.com/MDNTechOrg", label: "Twitter" },
    { icon: RxInstagramLogo, link: "https://www.instagram.com/mdntechorg/", label: "Instagram" },
  ];

  return (
    <section id="contact-us" className="flex flex-col items-center justify-center py-20 px-4 md:px-20 min-h-screen w-full">
      <motion.div
        variants={slideInFromTop}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
          Start Your Project
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          We work with founders, product teams, and enterprises who need a technical partner that understands both the product vision and the engineering depth required to realize it. Tell us what you&apos;re building — we&apos;ll tell you how we&apos;d approach it.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          variants={slideInFromLeft(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Let&apos;s Build Something That Matters
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Whether you&apos;re exploring an AI integration for an existing product, building a new platform from scratch, or need a technical audit of your current system — we&apos;re ready to talk.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                variants={slideInFromLeft(0.3 + index * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center p-4 rounded-lg border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm hover:bg-[#7042f825] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <info.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{info.label}</p>
                  <p className="text-white font-medium">{info.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Social Links */}
          {/* <motion.div
            variants={slideInFromLeft(0.6)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="pt-8"
          >
            <p className="text-gray-400 mb-4">Follow Us</p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-[#7042f825] transition-all duration-300"
                >
                  <social.icon className="w-6 h-6 text-cyan-400" />
                </motion.a>
              ))}
            </div>
          </motion.div> */}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          variants={slideInFromRight(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative p-8 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl blur-xl -z-10"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="Your Name"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                  placeholder="Tell us about your project..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isSubmitting ? "Sending..." : submitStatus === "success" ? "Message Sent!" : "Send Message"}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Success Message */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm text-center"
                >
                  Thank you! We&apos;ll get back to you soon.
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

