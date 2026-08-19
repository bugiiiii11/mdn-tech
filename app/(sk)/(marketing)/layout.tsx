// Same marketing chrome (navbar, footer, stars, fonts) as the English tree —
// one shell, two <html lang> roots. This re-export exists because layouts are
// resolved per route group, and duplicating the shell would fork it.
export { default } from "@/app/(en)/(marketing)/layout";
