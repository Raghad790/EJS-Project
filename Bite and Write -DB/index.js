import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const api_url = "http://localhost:4000";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

//Api call for the already created recipes
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${api_url}/recipes`);
    //passing data to the home.ejs file
    res.render("home.ejs", { recipes: response.data });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//create a new recipe file
app.get("/create", (req, res) => {
  res.render("create.ejs");
});
//about page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

//edit recipe route
app.get("/edit/:id", async (req, res) => {
  //the requried id is passed in the url(as a parameter)
  //and we are getting the recipe by id
  const id = parseInt(req.params.id);
  try {
    const response = await axios.get(`${api_url}/recipes/${id}`);
    res.render("update.ejs", { recipe: response.data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

//Create a new recipe
//this is the post request for creating a new recipe
app.post("/api/recipes", async (req, res) => {
  try {
    const response = await axios.post(`${api_url}/recipes`, {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      date: new Date(),
    });
    //send the body of the request to the api
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

//Edit recipe
app.post("/api/recipes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await axios.patch(`${api_url}/recipes/${id}`, req.body);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

//Api call for  deleting the recipe
app.get("/api/recipes/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await axios.delete(`${api_url}/recipes/${id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

// View Recipe
app.get("/view/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await axios.get(`${api_url}/recipes/${id}`);
    res.render("viewRecipe.ejs", { recipe: response.data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

app.listen(port, () => {
  console.log("Server: localhost:3000");
});
