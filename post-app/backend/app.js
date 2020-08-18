const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const path = require("path");
const app = express();

mongoose.connect("mongodb+srv://rishabh:rishabh@cluster0.br5un.mongodb.net/?w=majority",
{ dbName: "nodeangular", useNewUrlParser: true, useUnifiedTopology: true }, () => { })
.then(() => {
  console.log("Connected to database");
})
.catch((err) => {
  console.log(err);
  console.log("Connection Failed");
});
// mongoose.connect("mongodb+srv://rishabh:rishabh@cluster0.w7caw.mongodb.net/nodeangular?retryWrites=true&w=majority",
// { useNewUrlParser: true, useUnifiedTopology: true }, () => { })
// .then(() => {
//   console.log("Connected to database");
// })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));
//0dA5eQaIT16SlTar
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader('Access-Control-Allow-Credentials', 'true');
   next();
 });

app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes);

module.exports = app;
