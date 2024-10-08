const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const userRouter = require("./routers/users");
const cardRouter = require("./routers/cards");
const noteRouter = require("./routers/notes");
const boardRouter = require("./routers/boards");
const tokenRouter = require("./routers/token");
const kltoolAIRouter = require("./routers/kltool_ai");
const visionRouter = require("./routers/vision");
require("./utils/dbconnect");
// require("./utils/vision");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup express middleware
/* app.use((req, res, next) => {
    res.status(503).send('Site is currently under maintenance. Check back soon!')
}) */

// Setup static directory to use.
app.use(cookieParser());
app.use(express.static(publicDirectoryPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/js",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);
app.use(
  "/css",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(
    path.join(__dirname, "../node_modules/bootstrap-material-design/dist/js")
  )
);
app.use(
  "/css",
  express.static(
    path.join(__dirname, "../node_modules/bootstrap-material-design/dist/css")
  )
);
app.use(
  "/css",
  express.static(
    path.join(__dirname, "../node_modules/materialize-css/dist/css")
  )
);
app.use(
  "/js",
  express.static(
    path.join(__dirname, "../node_modules/materialize-css/dist/js")
  )
);
app.use(
  "/quill",
  express.static(path.join(__dirname, "../node_modules/quill/dist"))
);

app.use(userRouter);
app.use(cardRouter);
app.use(noteRouter);
app.use(boardRouter);
app.use(tokenRouter);
app.use(kltoolAIRouter);
app.use(visionRouter);

// Set views engine to use handlebars.
app.set("view engine", "hbs");
// Set views path.
app.set("views", viewsPath);
// Register Partials.
hbs.registerPartials(partialsPath);

app.get("/", auth, (req, res) => {
  if (req.user) {
    return res.render("dashboard", {
      firstName: req.user.first_name,
      lastName: req.user.last_name,
    });
  }
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

app.get("*", (req, res) => {
  res.status(404).render("404");
});

// Start server.
app.listen(port, () => {
  console.log("Server is up and running at port " + port);
});
