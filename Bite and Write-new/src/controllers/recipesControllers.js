import pool from "../config/db.js";
//Create
export const createRecipe = async (req, res) => {
  const { title, description, ingredients, instructions } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO recipes(title, description, ingredients, instructions) VALUES($1,$2,$3,$4)RETURNING *",
      [title, description, ingredients, instructions]
    );
    res.redirect("/");
  } catch (erorr) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Read Recipes
export const getAllRecipes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.render("home.ejs", { recipes: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get recipe by id
export const getRecipeById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM recipes WHERE id=$1 ", [id]);
    if (result.rows.length > 0) {
      res.render("viewRecipe.ejs", { recipe: result.rows[0] });
    } else {
      res.status(404).json({ error: "Recipe Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Update Recipe
export const updateRecipe = async (req, res) => {
  const { title, description, ingredients, instructions } = req.body;
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "UPDATE recipes SET title=$1, description=$2, ingredients=$3, instructions=$4 WHERE id=$5 RETURNING *",
      [title, description, ingredients, instructions, id]
    );
    if (result.rows.length > 0) {
      res.redirect(`/view/${id}`); // Redirect to the updated recipe's page
    } else {
      res.status(404).render("error.ejs", { error: "Recipe Not Found" });
    }
  } catch (error) {
    res.status(500).render("error.ejs", { error: "Internal Server Error" });
  }
};

//DELETE Recipe
export const deleteRecipe = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("DELETE FROM recipes WHERE id=$1", [id]);
    if (result.rowCount > 0) {
      res.redirect("/");
    } else {
      res.status(404).json({ error: "Recipe Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
