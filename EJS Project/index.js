import express from "express";
import bodyParser from "body-parser";

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

let recipes = [];

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs", { recipes: recipes });
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.post("/create", (req, res) => {
  const id = recipes.length + 1;
  const title = req.body.title;
  const description = req.body.description;
  const ingredients = req.body.ingredients;
  const instructions = req.body.instructions;
  const image = req.body.image;
  const date = new Date().toLocaleString();

  const newRecipe = new Recipe(
    id,
    title,
    description,
    ingredients,
    instructions,
    image,
    date
  );

  recipes.push(newRecipe);
  res.redirect("/");
});

app.get("/view", (req, res) => {
  const index = parseInt(req.query.index);
  const recipe = recipes[index];
  res.render("viewRecipe.ejs", { recipe: recipe });
});

app.get("/edit", (req, res) => {
  const index = parseInt(req.query.index);
  const recipe = recipes[index];
  res.render("update.ejs", { recipe: recipe, index: index });
});

app.post("/edit", (req, res) => {
  const index = parseInt(req.body.index);
  const originalId = recipes[index].id;
  recipes[index] = {
    id: originalId,
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    image: req.body.image,
    date: new Date().toLocaleString(),
  };
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const index = parseInt(req.body.index);
  recipes.splice(index, 1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server");
});
