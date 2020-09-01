import GhostContentAPI from "@tryghost/content-api";

const GHOST_URL = process.env.GHOST_URL || "http://ghost:2368/cms";
const GHOST_KEY = process.env.GHOST_KEY || "";

const api = new GhostContentAPI({
  url: GHOST_URL,
  key: GHOST_KEY,
  version: "v3",
});

export default api;
