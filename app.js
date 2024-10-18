const express = require("express");
const app = express();
const port = 8080;
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
// const path = require("path");

// KONEKSI DATABASE dan SCHEMANYA
require("./utils/db");
const User = require("./model/user");
const Post = require("./model/post");

// APPLICATION-LEVEL MIDDLEWARE
//CONFIGURASI URLENCODE
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

// BUILD-IN MIDDLEWARE
app.use(methodOverride("_method"));

//EXPRESS VIEW ENGINE (gunakan - EJS)
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// FLASH MESSAGE
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
// CONFIGURATION FLASH MESSAGE
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);
app.use(flash());

const beforeLogin = (req, res, next) => {
  if (!req.session.User_id) {
    return res.redirect("/login");
  } else {
    next();
  }
};
function isAuthenticated(req, res, next) {
  if (req.session.User_id) {
    next();
  } else {
    return res.redirect("/login");
  }
}

//DATA DUMMY
let comments = [
  {
    id: uuidv4(),
    username: "Andy",
    text: "Ini adalah komen milik ANDY",
  },
  {
    id: uuidv4(),
    username: "Bob",
    text: "Ini adalah komen milik BOB",
  },
  {
    id: uuidv4(),
    username: "Jhon",
    text: "Ini adalah komen milik JHON",
  },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

//***LOGIN PAGE***
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login Page",
  });
});
//LOGIN PROCESS
app.post("/login", async (req, res) => {
  const dataAuthor = await User.findOne({ username: req.body.username, password: req.body.password });
  if (dataAuthor) {
    req.session.User_id = dataAuthor._id;
    console.log("Session User ID after Login: ", req.session.User_id);
    res.redirect(`/users/author/${dataAuthor._id}`);
  } else {
    res.redirect("/login");
  }
});

// ***USERS***
app.get("/users", beforeLogin, async (req, res) => {
  const dataUser = await User.find();
  res.render("users/index", {
    title: "Index User",
    dataUser,
  });
});

// HALAMAN TAMBAH DATA USER
app.get("/users/create", beforeLogin, (req, res) => {
  res.render("users/create", {
    title: "Create Author",
  });
});
// PROCESS CREATE DATA USER
app.post("/users/create", async (req, res) => {
  // const dataUser = new User(req.body);
  // console.log(dataUser);
  // await dataUser.save();
  await User.insertMany(req.body);
  res.redirect("/users");
});

// HALAMAN DETAIL USER
app.get("/users/author/:id", isAuthenticated, async (req, res) => {
  // const { id } = req.params;
  // const detailUser = await User.findById(id)
  const detailUser = await User.findOne({ _id: req.params.id }).populate("posts");
  if (req.session.User_id !== req.params.id) {
    return res.status(404).send("Access Denied, You cannot view other users profiles.");
  }
  res.render("users/author", {
    title: "Author",
    detailUser,
  });
});

// ***POSTS***
// CREATE POST BY USER
app.get("/users/:id/posts/create", async (req, res) => {
  const userId = await User.findOne({ _id: req.params.id });
  res.render("posts/create", {
    title: "Create Post",
    userId,
  });
});
// PROCESS CREATE POST BY USER
app.post("/users/:id/posts/create", async (req, res) => {
  const author = await User.findOne({ _id: req.params.id });
  const article = new Post(req.body);
  // console.log(article);
  // console.log(author._id);
  author.posts.push(article);
  article.users = author;
  await author.save();
  await article.save();
  console.log(author);
  res.redirect(`/users/author/${author._id}`);
});
// DETAIL POSTS BY USER
app.get("/posts/:id", async (req, res) => {
  const dataPost = await Post.findOne({ _id: req.params.id }).populate("users");
  // res.send(dataPost);
  res.render("posts/index", {
    title: "Articles",
    dataPost,
  });
});

// DELETE AUTHOR AND POST
app.delete("/users/:id", (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }).then((result) => {
    res.redirect("/users");
  });
  // res.send(req.params.id);
});

// ***COMMENTS***
app.get("/comments", (req, res) => {
  res.render("comments/index", { comments });
});

// FORM CREATE COMMENT
app.get("/comments/create", (req, res) => {
  res.render("comments/create");
});
// PROCESS CREATE COMMENT
app.post("/comments/create", (req, res) => {
  const { username, text } = req.body;
  comments.push({ username, text, id: uuidv4() });
  res.redirect("/comments");
});

// DETAIL PAGE
app.get("/comments/detail/:id", (req, res) => {
  const { id } = req.params;
  const showComment = comments.find((e) => e.id === id);
  res.render("comments/detail", { showComment });
});

// UPDATE PAGE
app.get("/comments/update/:id", (req, res) => {
  const { id } = req.params;
  const commentUpdate = comments.find((e) => e.id === id);
  res.render("comments/update", { commentUpdate });
});
// PROCESS UPDATE
app.patch("/comments/update/:id", (req, res) => {
  const { id } = req.params;
  const newComment = req.body.text;
  const foundComment = comments.find((e) => e.id === id);
  foundComment.text = newComment;
  res.redirect("/comments");
});

// PROCESS DELETE
app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  // const deletItem = comments.find((e) => e.id === id);
  // comments.shift(deletItem);
  comments = comments.filter((e) => e.id !== id);
  res.redirect("/comments");
});

//MELAKUKAN PARSING DATA DARI BODY REQUEST
app.post("/exampleOrder", (req, res) => {
  const { item, qty } = req.body;
  res.send("POST ORDER RESPON ITEM: " + item + " DAN QUANTITY: " + qty);
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log("SERVER IS RUNNING IN http://localhost:" + port);
});
