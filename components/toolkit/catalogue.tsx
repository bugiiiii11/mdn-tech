// Thin re-export so the /toolkit components can keep importing "./catalogue".
//
// The real module is lib/marketing/toolkit-catalogue.ts — the ONE definition of
// "a skill in the ToolKit directory", shared with the homepage ToolKit section
// and the homepage FAQ. This file used to hold a near-identical copy of those
// derivations; two copies of the same counts is exactly the drift the lib
// module was written to kill, so nothing may be declared here again.

export * from "@/lib/marketing/toolkit-catalogue";
