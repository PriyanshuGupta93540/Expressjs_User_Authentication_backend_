import express from "express";
import dotenv from "dotenv";
import auth from "./router/auth.js";
import cookieParser from "cookie-parser";

import connectDB from "./Db/connectdb.js";

// make the dot env config
dotenv.config();

const app = express();

// Use to parse the json data into object which we send it
app.use(express.json());

// cookie parser is required to get the easily cookie by re.cookie
app.use(cookieParser());

// Link the routes
app.use("/", auth);

// call the db
connectDB();

const port = process.env.PORT || 3000;

// denote the app for running at port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
