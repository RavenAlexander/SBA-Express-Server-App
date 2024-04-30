const express = require("express");
const router = express.Router();

const ratings = require("../data/rate");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "api/rate",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ ratings, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const rating = {
        id: ratings[rating.length - 1].id + 1,
        username: req.body.username,
        title: req.body.title,
        rating: req.body.rating
      };

      ratings.push(rating);
      res.json(ratings[ratings.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("api/rate/:id")
  .get((req, res, next) => {
    const rating = ratings.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PUT",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (rating) res.json({ rating, links });
    else next();
  })
  .patch((req, res, next) => {
    const rating = ratings.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          ratings[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (rating) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const rating = ratings.find((p, i) => {
      if (p.id == req.params.id) {
        ratings.splice(i, 1);
        return true;
      }
    });

    if (rating) res.json(rating);
    else next();
  });

module.exports = router;
