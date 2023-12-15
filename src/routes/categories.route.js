import { Router } from "express";
import { verifyToken } from "../middlewares/authenticate.middleware.js";
import {
  getCategories,
  createCategory,
  deleteCategoryByID,
  getCategoryByID,
  updateCategoryByID,
} from "../controllers/categories.controller.js";

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

      const data = await getCategories(args);
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
      const data = await createCategory(args);
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
      const data = await getCategoryByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const args = { userID: req.user._id, ...req.params, ...req.body };
      const data = await updateCategoryByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const args = { userID: req.user._id, ...req.params };
      const data = await deleteCategoryByID(args);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

export default router;
