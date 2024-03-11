require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { expressjwt: jwt } = require('express-jwt'); 
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const { auth } = require('express-oauth2-jwt-bearer');

const { errorHandler } = require("./middleware/error.middleware.js");
const FilterDesign = require("./models/FilterDesign");

// var jwtCheck = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true, 
//     rateLimit: true, 
//     jwksRequestsPerMinute: 5, 
//     jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
//   }),
//   audience: process.env.AUTH0_IDENTIFIER,
//   issuer: process.env.AUTH0_DOMAIN,
//   algorithms: ['RS256']
// });

mongoose.connect(process.env.DATABASE_URL);
const database = mongoose.connection;
database.on("error", (error) => {
  console.log(error);
});
database.once("connected", async () => {
  console.log("Database Connected");

  const filters = await FilterDesign.find().sort({
    updatedAt: -1,
  });
  if(!filters.length){
    const filter = new FilterDesign({
      type: "square",
      author: "",
      image: "uploads/default_filterdesign.png",
    });
  
    try {
      await filter.save();
      console.log("seed success");
    } catch (error) {
      console.log("seed failed");
    }
  }
});

var corsOptions = {
  origin: ["http://localhost:3000", "https://livedab.de", "https://livedab.cc"]
};

global.appRootRir = __dirname;
const app = express();
// const directory = path.join(__dirname, "/uploads");
// app.use("/uploads", express.static(directory));
app.use('/uploads', express.static('uploads'));
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());

// app.use(jwtCheck);

const router = require("./routes");

app.use("/", router);
// app.use(errorHandler);

app.listen(8000, () => {
  console.log(`Server Started at ${8000}`);
});
