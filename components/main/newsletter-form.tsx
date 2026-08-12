"use client";

import { useState } from "react";

// Footer newsletter signup. Posts to /api/subscribe, which is zod-validated
// and rate-limited to 5/hour per IP (Phase 1 hardening) — so this form needs
// no client-side protection beyond honest state handling.

type Status = "idle" | "loading" | "success" | "error";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Read the body defensively: an edge/proxy error (502, a WAF block) can
      // return HTML, and a JSON parse failure there must not be reported to the
      // visitor as "network error" when the request plainly reached a server.
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setMessage(
          data?.error ??
            (response.status === 429
              ? "Too many signups from this address. Please try again later."
              : "Something went wrong. Please try again.")
        );
        return;
      }

      setStatus("success");
      setMessage(data?.message ?? "You're subscribed.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please check your connection.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          aria-describedby="newsletter-status"
          aria-invalid={status === "error"}
          className="flex-1 min-w-0 rounded-lg border border-[#7042f855] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition-colors"
        />
        {/* aria-busy rather than `disabled`: disabling the focused button
            drops keyboard focus to <body>, and the submit guard in onSubmit
            already blocks a double send. */}
        <button
          type="submit"
          aria-busy={status === "loading"}
          className="rounded-lg border border-[#7042f855] bg-[#7042f81f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7042f833] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors whitespace-nowrap"
        >
          {status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </div>

      <p
        id="newsletter-status"
        role="status"
        aria-live={status === "error" ? "assertive" : "polite"}
        className={`mt-2 text-xs min-h-[1rem] ${
          status === "error" ? "text-red-300" : "text-cyan-400"
        }`}
      >
        {message}
      </p>
    </form>
  );
};
