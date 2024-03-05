require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const FilterDesign = require("./models/FilterDesign");

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

// var corsOptions = {
//   origin: ["http://3.123.34.123:3000","http://3.123.34.123","http://localhost:3000","http://127.0.0.1:5500", "http://livedab.de"]
// };

global.appRootRir = __dirname;
const app = express();
// const directory = path.join(__dirname, "/uploads");
// app.use("/uploads", express.static(directory));
app.use('/uploads', express.static('uploads'));
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());


const router = require("./routes");

app.use("/", router);

app.listen(8000, () => {
  console.log(`Server Started at ${8000}`);
});
