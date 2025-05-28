import pg from "pg";
//to get the attributes from the .env file
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
//inside the pg pakage there is a class called Pool (constructor function)
//from this constructor function we can create a new object of the class
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//export the pool object to use it in other files
export default pool;
