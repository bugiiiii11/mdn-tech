"use client";

import { useEffect, useState } from "react";
import { captureAttribution, type Attribution } from "@/lib/marketing/attribution";

/**
 * Records first-touch attribution on page load. Mounted once in the marketing
 * layout, so it runs on EVERY marketing page rather than only the two that
 * happen to contain a form.
 *
 * This is load-bearing, not belt-and-braces: the campaign emails point at
 * /sk/referencie/royal-stroje, which has no form at all. Without a
 * layout-level capture, a prospect who reads the case study and then clicks
 * through to the /sk form is recorded as "direct" — the campaign would appear
 * to have converted nobody. Capture must happen where the visitor LANDS.
 */
export const AttributionCapture = () => {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
};

/**
 * Hidden inputs carrying campaign attribution into an EmailJS `sendForm`
 * submission (rework plan C3). Drop inside the <form> of any lead form.
 *
 * `sendForm` posts every named field, but EmailJS only renders the ones the
 * TEMPLATE references. To read these in the sales inbox, the template needs
 * at minimum a `{{attribution}}` line — the other fields are there so a
 * future CRM import has the raw values instead of a parsed sentence.
 *
 * Values are filled in an effect, not during render: capture reads
 * sessionStorage and window.location, so rendering them directly would
 * hydrate-mismatch against the server's empty strings.
 */
export const AttributionFields = ({ formId }: { formId: string }) => {
  const [data, setData] = useState<Attribution | null>(null);

  useEffect(() => {
    setData(captureAttribution());
  }, []);

  const value = (key: keyof Attribution) => data?.[key] ?? "";

  return (
    <>
      <input type="hidden" name="attribution" value={value("attribution")} readOnly />
      <input type="hidden" name="utm_source" value={value("utm_source")} readOnly />
      <input type="hidden" name="utm_medium" value={value("utm_medium")} readOnly />
      <input type="hidden" name="utm_campaign" value={value("utm_campaign")} readOnly />
      <input type="hidden" name="utm_term" value={value("utm_term")} readOnly />
      <input type="hidden" name="utm_content" value={value("utm_content")} readOnly />
      <input type="hidden" name="referrer" value={value("referrer")} readOnly />
      <input type="hidden" name="landing_page" value={value("landing_page")} readOnly />
      {/* Which form produced the lead — /sk and / share one EmailJS template. */}
      <input type="hidden" name="form_id" value={formId} readOnly />
    </>
  );
};
