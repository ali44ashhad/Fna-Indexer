import app from "../server.js";

export default function handler(req, res) {
  // Pass directly to Express - it will handle CORS
  app(req, res);
}

