const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser')

app.set("view engine", "ejs");
//parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public')); //middleware to allow static files

const users = require("./routes/users");
const posts = require("./routes/posts");
const ratings = require("./routes/rate");

const error = require("./utilities/error");


//index.ejs template
app.get("/", (req, res) => {
  const title = { name: "Recipe Viewer"};
  const posts = [
    {
      id: 1,
      userId: 1,
      title: "Recipe 1",
      content:
        "similique esse doloribus nihil accusamus\nomnis dolorem fuga consequuntur reprehenderit fugit recusandae temporibus\nperspiciatis cum ut laudantium\nomnis aut molestiae vel vero",
    },
    {
      id: 2,
      userId: 1,
      title: "Recipe 2",
      content:
        "eum sed dolores ipsam sint possimus debitis occaecati\ndebitis qui qui et\nut placeat enim earum aut odit facilis\nconsequatur suscipit necessitatibus rerum sed inventore temporibus consequatur",
    },
    {
      id: 3,
      userId: 1,
      title: "Recipe 3",
      content:
        "non et quaerat ex quae ad maiores\nmaiores recusandae totam aut blanditiis mollitia quas illo\nut voluptatibus voluptatem\nsimilique nostrum eum",
    },
    {
      id: 4,
      userId: 2,
      title: "Recipe 4",
      content:
        "odit magnam ut saepe sed non qui\ntempora atque nihil\naccusamus illum doloribus illo dolor\neligendi repudiandae odit magni similique sed cum maiores",
    },
    {
      id: 5,
      userId: 2,
      title: "Recipe 5",
      content:
        "alias dolor cumque\nimpedit blanditiis non eveniet odio maxime\nblanditiis amet eius quis tempora quia autem rem\na provident perspiciatis quia",
    },
    {
      id: 6,
      userId: 2,
      title: "Recipe 6",
      content:
        "debitis eius sed quibusdam non quis consectetur vitae\nimpedit ut qui consequatur sed aut in\nquidem sit nostrum et maiores adipisci atque\nquaerat voluptatem adipisci repudiandae",
    },
    {
      id: 7,
      userId: 3,
      title: "Recipe 7",
      content:
        "deserunt eos nobis asperiores et hic\nest debitis repellat molestiae optio\nnihil ratione ut eos beatae quibusdam distinctio maiores\nearum voluptates et aut adipisci ea maiores voluptas maxime",
    },
    {
      id: 8,
      userId: 3,
      title: "Recipe 8",
      content:
        "rerum ut et numquam laborum odit est sit\nid qui sint in\nquasi tenetur tempore aperiam et quaerat qui in\nrerum officiis sequi cumque quod",
    },
    {
      id: 9,
      userId: 3,
      title: "Recipe 9",
      content:
        "ea velit perferendis earum ut voluptatem voluptate itaque iusto\ntotam pariatur in\nnemo voluptatem voluptatem autem magni tempora minima in\nest distinctio qui assumenda accusamus dignissimos officia nesciunt nobis",
    },
  ];
  res.render("pages/index", { title: title , posts: posts } );
});

// users.ejs template
app.get("/users", (req, res) => {
  const title = {name: "User List"};
  const users = [
    {
      id: 1,
      name: "Carey",
      username: "cyare23",
      email: "cy23@example.com",
    },
    {
      id: 2,
      name: "Mikoto",
      username: "Miiko",
      email: "mikoto_u@example.com",
    },
    {
      id: 3,
      name: "Ronald",
      username: "RonRonRon",
      email: "mronald@example.com",
    },
  ];
  res.render("pages/users", {title: title, users: users});
});

//rate.ejs template
app.get("/rate", (req, res) => {
  const title = {name: "Rate Recipes"};
  res.render("pages/rate", {title: title} );
})


app.get("/image", (req, res) => {
  res.download('./public/image/cat.jpeg')
});



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
