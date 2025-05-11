import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

class Recipe {
  constructor(id, title, description, ingredients, instructions, image, date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.image = image;
    this.date = date;
  }
}

let recipes = [
  new Recipe(
    1,
    "Spaghetti Bolognese",
    "Classic Italian pasta with meat sauce.",
    ["Spaghetti", "Ground beef", "Tomato sauce", "Garlic", "Onion"],
    "Cook meat, add sauce, boil pasta, combine.",
    "/images/spg.jpg",
    new Date()
  ),
  new Recipe(
    2,
    "Pancakes",
    "Fluffy homemade pancakes.",
    ["Flour", "Milk", "Eggs", "Baking powder", "Salt"],
    "Mix ingredients, cook on griddle, flip and serve.",
    "/images/pancake.jpg",
    new Date()
  ),
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //parsing the json

let lastId = 2;

//Read Recipes
//Get all recipes
app.get("/recipes", (req, res) => {
  res.json(recipes);
});
//Get recipe by id
app.get("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (recipe) return res.json(recipe);
  res.status(404).json({ error: "Recipe Not Found" });
});

//Create Recipe

app.post("/recipes", (req, res) => {
  lastId++;
  const newRecipe = {
    id: lastId,
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    image: req.body.image,
    date: new Date(),
  };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

//Update Recipe
app.patch("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);
  const recipeObj = recipes[recipeIndex];
  const updatedRecipe = {
    id: id,
    title: req.body.title || recipeObj.title,
    description: req.body.description || recipeObj.description,
    ingredients: req.body.ingredients || recipeObj.ingredients,
    instructions: req.body.instructions || recipeObj.instructions,
    image: req.body.image || recipeObj.image,
    date: recipeObj.date,
  };

  recipes[recipeIndex] = updatedRecipe;
  res.status(200).json(updatedRecipe);
});

//Update
app.put("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const recipeIndex = recipes.findIndex((recipe) => recipe.id === id);
  if (recipeIndex > -1) {
    const updatedRecipe = {
      id: id,
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      image: req.body.image,
      date: new Date(),
    };

    recipes[recipeIndex] = updatedRecipe;
    res.status(200).json(updatedRecipe);
  } else {
    return res.status(404).json({ error: "Recipe Not Found" });
  }
});

//Delete Recipe
app.delete("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = recipes.findIndex((recipe) => recipe.id === id);
  if (index > -1) {
    recipes.splice(index, 1);
    res.sendStatus(204); // No Content
  } else {
    res.status(404).json({ error: "Recipe Not Found" });
  }
});

app.listen(port, () => {
  console.log("API:localhost:4000");
});
