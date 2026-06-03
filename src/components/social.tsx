import { createLucideIcon } from "lucide-react-native";

// Facebook Icon SVG Path
export const Facebook = createLucideIcon("Facebook", [
  [
    "path",
    {
      d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
      key: "fb-path-1",
    },
  ],
]);

// Instagram Icon SVG Path
export const Instagram = createLucideIcon("Instagram", [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5", key: "ig-rect" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", key: "ig-path-1" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5", key: "ig-line" }],
]);

// Twitter (X) Icon SVG Path - Rescaled for visual consistency
export const Twitter = createLucideIcon("Twitter", [
  [
    "path",
    {
      d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      key: "tw-path-1",
    },
  ],
]);

export const Youtube = createLucideIcon("YouTube", [
  [
    "path",
    {
      d: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z",
      key: "yt-path-1",
    },
  ],
  [
    "path",
    {
      d: "m9.75 15.02 5.75-3.02-5.75-3.02v6.04z",
      key: "yt-path-2",
    },
  ],
]);

export const Tiktok = createLucideIcon("TikTok", [
  [
    "path",
    {
      d: "M9 12a4 4 0 1 0 4 4V2a5 5 0 0 0 5 5",
      key: "tt-path-1",
    },
  ],
]);
