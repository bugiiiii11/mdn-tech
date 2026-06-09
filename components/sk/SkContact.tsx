"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { slideInFromLeft, slideInFromRight } from "@/lib/motion";
import { SK_NAP } from "@/constants/sk";

export const SkContact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "limit"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error: any) {
      console.error("EmailJS error:", error);
      if (error?.status === 429 || error?.text?.includes("limit")) {
        setSubmitStatus("limit");
        setErrorMessage(
          `Mesačný limit dosiahnutý. Napíšte nám priamo na ${SK_NAP.email}`
        );
      } else {
        setSubmitStatus("error");
        setErrorMessage("Správu sa nepodarilo odoslať. Skúste to znova.");
      }
      setTimeout(() => setSubmitStatus("idle"), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiPhone,
      label: "Zavolajte",
      value: SK_NAP.phoneDisplay,
      link: SK_NAP.phoneHref,
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: SK_NAP.whatsappDisplay,
      link: SK_NAP.whatsappHref,
    },
    {
      icon: FiMail,
      label: "Email",
      value: SK_NAP.email,
      link: SK_NAP.emailHref,
    },
  ];

  return (
    <section
      id="kontakt"
      className="flex flex-col items-center justify-center py-20 px-4 md:px-20 w-full max-w-full overflow-hidden"
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-6 text-center"
      >
        Povedzte nám o svojom projekte
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 },
          },
        }}
        className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto mb-12 text-center"
      >
        Nezáväzná konzultácia zdarma. Napíšte nám alebo zavolajte — ozveme sa
        vám a spolu nájdeme najlepšie riešenie pre váš biznis.
      </motion.p>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <motion.div
          variants={slideInFromLeft(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              Expandujte svoj biznis online
            </h3>
            <p className="text-gray-400 mb-2 leading-relaxed text-sm md:text-base">
              Či už začínate, alebo už podnikáte — ak potrebujete partnera, ktorý
              myslí biznisovo a dodáva rýchlo, ozvite sa. Žiadne zdĺhavé procesy,
              len priamy rozhovor s ľuďmi, ktorí to postavia.
            </p>
            <p className="text-sm text-gray-500">
              Pôsobíme po celom Slovensku.
            </p>
          </div>

          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.link}
                target={info.label === "WhatsApp" ? "_blank" : undefined}
                rel={
                  info.label === "WhatsApp" ? "noopener noreferrer" : undefined
                }
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
        </motion.div>

        {/* Form */}
        <motion.div
          variants={slideInFromRight(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative p-8 rounded-xl border border-[#7042f88b] bg-[#7042f815] backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl blur-xl -z-10" />

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="sk-name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Meno
                </label>
                <input
                  type="text"
                  id="sk-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="Vaše meno"
                />
              </div>

              <div>
                <label
                  htmlFor="sk-email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="sk-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="vas.email@priklad.sk"
                />
              </div>

              <div>
                <label
                  htmlFor="sk-phone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Telefón <span className="text-gray-500">(voliteľné)</span>
                </label>
                <input
                  type="tel"
                  id="sk-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  placeholder="0900 000 000"
                />
              </div>

              <div>
                <label
                  htmlFor="sk-message"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Správa
                </label>
                <textarea
                  id="sk-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                  placeholder="Napíšte nám, čo potrebujete..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 button-primary text-center text-white cursor-pointer rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Odosielam..."
                  : submitStatus === "success"
                  ? "Správa odoslaná!"
                  : "Odoslať správu"}
              </motion.button>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm text-center"
                >
                  Ďakujeme! Čoskoro sa vám ozveme.
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm text-center"
                >
                  {errorMessage}
                </motion.div>
              )}

              {submitStatus === "limit" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-sm text-center"
                >
                  {errorMessage}
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
