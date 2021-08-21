const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const app = express();
const port = 3000;

// gunakan ejs
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");

// Third Party Middleware
app.use(expressLayouts);
app.use(morgan("dev"));

// Built-in Middleware
app.use(express.static("public"));

// Application Level Middleware
app.use((req, res, next) => {
  console.log("Time", Date.now());
  next();
});

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Ade Pranaya",
      email: "adepranaya@gmail.com"
    },
    {
      nama: "Hazar Hamzah",
      email: "hazarhamzah@gmail.com"
    },
    {
      nama: "Muhammad Dwika Ilyas Ruhyat",
      email: "dwika@gmail.com"
    }
  ];
  res.render("index", {
    nama: "Ade Pranaya",
    title: "Halaman Home",
    mahasiswa
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/product/:id", (req, res) => {
  const product = "Product ID : " + req.params.id;
  const category = "Category ID : " + req.query.category;
  res.send(product + "<br>" + category);
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
