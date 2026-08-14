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

// breadcrumbListSchema() was removed on 2026-08-14 together with the product
// pages' visible breadcrumb. The rule it encoded still stands: emit
// BreadcrumbList only for a trail the page actually renders, built from the
// same array, so the schema cannot describe navigation a visitor cannot see.
