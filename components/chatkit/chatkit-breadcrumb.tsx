import Link from "next/link";

// Visible breadcrumb for /chatkit. It exists so the BreadcrumbList JSON-LD on
// app/(marketing)/chatkit/page.tsx mirrors real UI — schema without matching
// visible markup is the mismatch Google penalises.
//
// Layout note: PageHero hard-codes mt-40 to clear the fixed navbar, so this
// strip sits at mt-28 and pulls the hero back up with -mb-36. Net effect: the
// crumb clears the navbar and the hero pill lands just below it.

export const ChatKitBreadcrumb = () => (
  <nav
    aria-label="Breadcrumb"
    className="relative z-[20] mt-28 -mb-36 w-full px-4 md:px-20"
  >
    <ol className="mx-auto flex max-w-6xl items-center gap-2 text-sm text-gray-400">
      <li>
        <Link
          href="/"
          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
        >
          Home
        </Link>
      </li>
      <li aria-hidden="true" className="text-gray-500">
        /
      </li>
      <li aria-current="page" className="text-gray-400">
        ChatKit
      </li>
    </ol>
  </nav>
);
