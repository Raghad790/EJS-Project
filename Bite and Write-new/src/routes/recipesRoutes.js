import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  updateRecipe,
  getRecipeById,
} from "../controllers/recipesControllers.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/view/:id", getRecipeById);
router.post("/create", createRecipe);
router.post("/edit/:id", updateRecipe);
router.post("/delete/:id", deleteRecipe);
router.get("/about", (req, res) => {
  res.render("about.ejs");
});

router.get("/create", (req, res) => {
  res.render("create.ejs");
});
export default router;
