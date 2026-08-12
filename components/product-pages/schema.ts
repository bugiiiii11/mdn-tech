import type { Crumb } from "./motion-primitives";

// Canonical JSON-LD entity ids for the site.
//
// app/layout.tsx emits ONE Organization node and ONE WebSite node for the whole
// site. Every other page must point at them by @id rather than re-declaring a
// second anonymous copy of the same company — three unlinked Organization nodes
// for one business is the ambiguity these ids remove.
//
// Import organizationRef() / websiteRef() for author, publisher and isPartOf.

export const SITE_URL = "https://mdntech.org";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Use for author / publisher / provider. */
export const organizationRef = () => ({ "@id": ORGANIZATION_ID });

/** Use for isPartOf on a WebPage or CollectionPage node. */
export const websiteRef = () => ({ "@id": WEBSITE_ID });

/**
 * BreadcrumbList built from the same `trail` array PageHero renders, so the
 * schema can never describe a trail the visitor cannot see.
 *
 * `currentUrl` is the absolute (or site-relative) URL of the page itself; it is
 * attached to the final crumb, which carries no href of its own.
 */
export const breadcrumbListSchema = (
  trail: readonly Crumb[],
  currentUrl?: string
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((crumb, index) => {
    const href =
      crumb.href ?? (index === trail.length - 1 ? currentUrl : undefined);

    return {
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(href ? { item: absoluteUrl(href) } : {}),
    };
  }),
});

function absoluteUrl(href: string): string {
  if (/^https?:\/\//.test(href)) return href;
  const path = href.startsWith("/") ? href : `/${href}`;
  // "/" would otherwise produce a trailing slash the canonical does not use.
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
