
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser')

app.set("view engine", "ejs");
//parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public')); //to allow static files


//index.ejs template
app.get("/", (req, res) => {
  const title = { name: "Recipe Viewer"};
  res.render("pages/index", { title: title } );
});

// users.ejs template
app.get("/users", (req, res) => {
  const title = {name: "User List"};
  res.render("pages/users", {title: title});
});

//rate.ejs template
app.get("/rate", (req, res) => {
  const title = {name: "Rate Recipes"};
  res.render("pages/rate", {title: title} );
})


app.get("/image", (req, res) => {
  res.download('./image/cat.jpeg')
});

const users = require("./routes/users");
const posts = require("./routes/posts");
const ratings = require("./routes/rate");

const error = require("./utilities/error");


// Time-Logging Middlewaare
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});


// Middleware to check for if an API query exists
// If the query is not verified,
// we do not call next(); this is the end.
app.use("/api", function (req, res, next) {
  var input = req.query;

  // Check for the absence of something.
  if (input !== req.query) next(error(400, "Input Required"));
 
  req.input = input;
  next();
});

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/rate", ratings);

// Adding some HATEOAS links.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api",
        rel: "api",
        type: "GET",
      },
    ],
  });
});

// Adding some HATEOAS links.
app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
      {
        href: "api/rate",
        rel: "rate",
        type: "GET",
      },
      {
        href: "api/rate",
        rel: "rate",
        type: "POST",
      },
    ],
  });
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
