import express from "express";

const auth = express.Router();

auth.post("/request", (req, res) => {
  return res.status(200).json(req.user);
});

auth.post("/confirm", (req, res) => {
  return res.status(200).json(req.user);
});

export function initWebAuthEmailController(app) {
  app.use("/api/auth/email", auth);
}
