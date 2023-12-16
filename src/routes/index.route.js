import express from "express";
import auth from "./auth.route.js";
import categories from "./categories.route.js";
import cars from "./cars.route.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Home route 😊!");
});

router.use("/auth", auth);
router.use("/cars", cars);
router.use("/categories", categories);

router.get("/docs", (req, res) => {
  res.redirect("https://www.google.com");
});

export default router;
