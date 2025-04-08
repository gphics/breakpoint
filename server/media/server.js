// loading dotenv to enable the use of env variables
require("dotenv").config();
// running the database
require("./config/dbConnect")();
const express = require("express");
const fileUpload = require("express-fileupload");
const port = process.env.PORT;
const app = express();
const cors = require("cors");
const router = require("./routers");
const corsOrigins = process.env.ORIGINS.split(",");
console.log(corsOrigins);

// middlewares
app.use(cors({ origin: corsOrigins }));
app.use(express.json());
app.use(fileUpload());

// router
app.use("/", router);

// Error Handler
app.use((err, req, res, next) => {
  const { message, code = 400 } = err;
  res.status(code).json({ data: null, err: { message, code } });
});

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log("SERVER RUNNING !!!");
});
