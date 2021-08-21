const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const { loadContact, findContact } = require("./utils/contacts");

// gunakan ejs
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");
app.use(expressLayouts); // Third Party Middleware
app.use(express.static("public")); // Built-in Middleware

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
  res.render("about", {
    title: "Halaman About",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    title: "Halaman Contact",
    contacts
  });
});

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    title: "Halaman Detail Contact",
    contact
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
