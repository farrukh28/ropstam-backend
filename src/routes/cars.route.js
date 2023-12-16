import { Router } from "express";
import { verifyToken } from "../middlewares/authenticate.middleware.js";
import {
  getCarByID,
  getCars,
  createCar,
  updateCarByID,
  deleteCarByID,
} from "../controllers/cars.controller.js";

const router = Router();

router
  .route("/")
  .all(verifyToken)
  .get(async (req, res, next) => {
    try {
      const args = {
        userID: req.user._id,
        ...req.query,
      };

      const data = await getCars(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const args = {
        userID: req.user._id,
        ...req.body,
      };
      const data = await createCar(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

router
  .route("/:ID")
  .all(verifyToken)
  .get(async (req, res, next) => {
    try {
      const args = { ...req.params };
      const data = await getCarByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const args = { userID: req.user._id, ...req.params, ...req.body };
      const data = await updateCarByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const args = { userID: req.user._id, ...req.params };
      const data = await deleteCarByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

export default router;
