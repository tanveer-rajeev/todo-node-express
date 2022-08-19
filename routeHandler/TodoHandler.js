const mongoose = require("mongoose");
const express = require("express");
const todoSchema = require("../schemas/todoSchema");
const router = express.Router();
const Todo = mongoose.model("Todo", todoSchema);
const checkLoggedInUser = require("../Middlewares/checkLoggedInUser");

const errResponse = (err, res, status, data) => {
  if (err) {
    res.status(500).json({
      error: "Server side error",
    });
  } else {
    res.status(200).json({
      result: data,
      message: `Todo ${status} successfully`,
    });
  }
};

router.get("/findByJs", async (req, res) => {
  try {
    const data = await Todo.findJs();
    errResponse(false, res, "showing only active data", data);
  } catch (err) {
    errResponse(err, res);
  }
});

router.get("/findByLanguage", async (req, res) => {
  try {
    const data = await Todo.find().findByLanguage("java");
    errResponse(false, res, "filter by language", data);
  } catch (err) {
    errResponse(err, res);
  }
});

router.get("/active", async (req, res) => {
  const todo = new Todo();
  try {
    const data = await todo.findActive();
    errResponse(false, res, "showing only active data", data);
  } catch (err) {
    errResponse(err, res);
  }
});

router.get("/active-callback", (req, res) => {
  const todo = new Todo();

  todo.findActiveCallback((err, data) =>
    errResponse(err, res, "showing only active data", data)
  );
});

router.get("/", checkLoggedInUser, async (req, res) => {
  Todo.find({ status: "active" }, (err, data) => {
    errResponse(err, res, "all data get", data);
  })
    .select({
      _id: 0,
      __v: 0,
      date: 0,
    })
    .limit(2);
});

router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });
    errResponse(res, "all data get", data);
  } catch (err) {
    res.status(500).json({
      error: "Server side error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const postTodo = new Todo(req.body);
    const data = await postTodo.save();
    errResponse(false, res, "data save", data);
  } catch (err) {
    errResponse(err, res);
  }
});

router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    errResponse(err, res, "saved all");
  });
});

router.put("/:id", async (req, res) => {
  try {
    const data = await Todo.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          status: req.body.status,
        },
      }
    );
    errResponse(false, res, "data updated", data);
  } catch (err) {
    errResponse(err, res);
  }
});

router.delete("/:id", async (req, res) => {
  // When using callback then await has to avoid.
  Todo.deleteOne({ _id: req.params.id }, (err, data) => {
    errResponse(err, res, "deleted", data);
  });
});

module.exports = router;
