const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
  deleteContact,
  updateContact
} = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// gunakan ejs
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");
app.use(expressLayouts); // Third Party Middleware
app.use(express.static("public")); // Built-in Middleware
app.use(express.urlencoded({ extended: true })); // Built-in Middleware

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(flash());

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
    title: "Halaman About"
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    title: "Halaman Contact",
    contacts,
    msg: req.flash("msg")
  });
});

// Halaman Form Tambah Data Contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Data Contact"
  });
});
// Halaman Form Ubah Data Contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    title: "Form Ubah Data Contact",
    contact
  });
});
// Process Tambah Data Contact
app.post(
  "/contact",
  [
    body("nama").custom(value => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error("Nama Contact sudah digunakan!");
      }
      return true;
    }),
    check("email").isEmail().withMessage("Email tidak valid!"),
    check("nohp").isMobilePhone("id-ID").withMessage("No HP tidak valid!")
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Form Tambah Data Contact",
        errors: errors.array()
      });
    } else {
      addContact(req.body);
      // kirimkan flash message
      req.flash("msg", "Data contact berhasil ditambahkan");
      res.redirect("/contact");
    }
  }
);
// Process ubah Data Contact
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama Contact sudah digunakan!");
      }
      return true;
    }),
    check("email").isEmail().withMessage("Email tidak valid!"),
    check("nohp").isMobilePhone("id-ID").withMessage("No HP tidak valid!")
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "Form Ubah Data Contact",
        errors: errors.array(),
        contact: req.body
      });
    } else {
      updateContact(req.body);
      // kirimkan flash message
      req.flash("msg", "Data contact berhasil diubah!");
      res.redirect("/contact");
    }
  }
);

// proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  // jika kontak tidak ada
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  }
});

// Halaman Detail Contact
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail-contact", {
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
