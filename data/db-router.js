const express = require("express");

const Posts = require("./db");

const router = express.Router();

router.use(express.json());

//GET requests

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  if (!id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else {
    Posts.findById(id)
      .then(post => {
        if (post[0]) {
          res.status(200).json(post);
        } else {
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist."
            });
        }
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res
          .status(500)
          .json({ error: "The post information could not be retrieved." });
      });
  }
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  if (!id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  }
  Posts.findPostComments(req.params.id)
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "error geting Post Comments" });
    });
});

//!GET requests

//POST requests

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: "Error adding the Post"
        });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  if (!id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (!req.body.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.insertComment(req.body)
      .then(comments => {
        res.status(201).json(comments);
      })
      .catch(error => {
        // log error to database
        console.log(error);
        res.status(500).json({
          message: "Error adding the Post Comment"
        });
      });
  }
});

//!POST requests

//DELETE requests

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been nuked" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the post"
      });
    });
});
//!DELETE requests

//PUT requests
router.put("/:id", (req, res) => {
  const changes = req.body;
  const id = req.params.id;

  if (!id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.update(id, changes)
      .then(post => {
        res.status(200).json(changes);
      })
      .catch(err => {
        console.log("error on PUT /api/users/:id", err);
        res
          .status(500)
          .json({ errorMessage: "error adding the user to the database" });
      });
  }
});
//!PUT requests

module.exports = router;
