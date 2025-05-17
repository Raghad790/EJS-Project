import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "recipes",
  password: "Raghadkk772",
  port: 5432, //defult port
});
db.connect()
  .then(() => {
    console.log("connected to Postgres");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //parsing the json
//Read Recipes
//Get all recipes
app.get("/recipes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM recipes");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Get recipe by id
app.get("/recipes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query("SELECT * FROM recipes WHERE id=$1 ", [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Recipe Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Create Recipe

app.post("/recipes", async (req, res) => {
  const { title, description, ingredients, instructions } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO recipes(title, description, ingredients, instructions) VALUES($1,$2,$3,$4)RETURNING *",
      [title, description, ingredients, instructions]
    );
    res.status(201).json(result.rows[0]);
  } catch (erorr) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update Recipe
app.patch("/recipes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, ingredients, instructions } = req.body;
  try {
    const fields = [];
    const values = [];
    let count = 1;

    if (title) {
      fields.push(`title=$${count++}`);
      values.push(title);
    }

    if (description) {
      fields.push(`description=$${count++}`);
      values.push(description);
    }
    if (ingredients) {
      fields.push(`ingredients=$${count++}`);
      values.push(ingredients);
    }
    if (instructions) {
      fields.push(`instructions=$${count++}`);
      values.push(instructions);
    }

    values.push(id);
    const result = await db.query(
      `UPDATE recipes SET ${fields.join(
        ", "
      )} ,date=NOW() WHERE id=$${count} RETURNING *`,
      values
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: `Post id ${id} Not Found` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update
app.put("/recipes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, ingredients, instructions } = req.body;
  try {
    const result = await db.query(
      "UPDATE recipes SET title=$1, description=$2, ingredients=$3, instructions=$4, date=NOW() WHERE id=$5 RETURNING *",
      [title, description, ingredients, instructions, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: `Post id ${id}Not Found` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Delete Recipe
app.delete("/recipes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      "DELETE FROM recipes WHERE id=$1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: `Post id ${id} Not Found` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("API:localhost:4000");
});
