const express = require("express");
const router = express.Router();

const myDb = require("../db/myMongoDB.js");

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/tasks");
});

// http://localhost:3000/references?pageSize=24&page=3&q=John
router.get("/tasks", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getTasksCount(query);
    let tasks = await myDb.getTasks(query, page, pageSize);
    res.render("./pages/index", {
      tasks,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/tasks/:task_id/edit", async (req, res, next) => {
  const task_id = req.params.task_id;

  const msg = req.query.msg || null;
  try {
    let task = await myDb.getTaskByID(task_id);
    let tags = await myDb.getTagsByTaskID(task_id);

    console.log("edit task", {
      task,
      tags,
      msg,
    });

    res.render("./pages/editTask", {
      task,
      tags,
      msg,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/tasks/:task_id/edit", async (req, res, next) => {
  const task_id = req.params.task_id;
  const task = req.body;

  try {
    let updateResult = await myDb.updateTaskByID(task_id, task);
    console.log("update", updateResult);

    if (updateResult && updateResult.modifiedCount === 1) {
      res.redirect("/tasks/?msg=Updated");
    } else {
      res.redirect("/tasks/?msg=Error Updating");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/tasks/:taskID/addTag", async (req, res, next) => {
  console.log("Add Tag", req.body);
  const taskID = req.params.taskID;
  const tagID = req.body.tagID;

  try {
    let updateResult = await myDb.addTagIDToTaskID(taskID, tagID);
    console.log("addTagIDToTaskID", updateResult);

    if (updateResult && updateResult.modifiedCount === 1) {
      res.redirect(`/tasks/${taskID}/edit?msg=Tag added`);
    } else {
      res.redirect(`/tasks/${taskID}/edit?msg=Error adding tag`);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/tasks/:taskID/removeTag/:tagID", async (req, res, next) => {
  console.log("Remove Tag", req.body);
  const taskID = req.params.taskID;
  const tagID = req.params.tagID;

  try {
    let updateResult = await myDb.removeTagIDFromTaskID(taskID, tagID);
    console.log("removeTagIDFromTaskID", updateResult);

    if (updateResult && updateResult.modifiedCount === 1) {
      res.redirect(`/tasks/${taskID}/edit?msg=Tag removed`);
    } else {
      res.redirect(`/tasks/${taskID}/edit?msg=Error removing tag`);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/tasks/:task_id/delete", async (req, res, next) => {
  const task_id = req.params.task_id;

  try {
    let deleteResult = await myDb.deleteTaskByID(task_id);
    console.log("delete", deleteResult);

    if (deleteResult && deleteResult.deletedCount === 1) {
      res.redirect("/tasks/?msg=Deleted");
    } else {
      res.redirect("/tasks/?msg=Error Deleting");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/tasks/:task_id/finish", async (req, res, next) => {
  const task_id = req.params.task_id;

  try {
    let finishResult = await myDb.finishTaskByID(task_id);
    console.log("finish", finishResult);

    if (finishResult && finishResult.modifiedCount === 1) {
      res.redirect("/tasks/?msg=Finished");
    } else {
      res.redirect("/tasks/?msg=Error Fiishing");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/createTask", async (req, res, next) => {
  const task = req.body;

  try {
    const insertRes = await myDb.insertTask(task);

    console.log("Inserted", insertRes);
    res.redirect("/tasks/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.get("/tags", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getTagsCount(query);
    let tags = await myDb.getTags(query, page, pageSize);
    console.log({ tags });
    console.log({ total });
    res.render("./pages/tags", {
      tags,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/tags/:tag_id/delete", async (req, res, next) => {
  const tag_id = req.params.tag_id;

  try {
    let deleteResult = await myDb.deleteTagByID(tag_id);
    console.log("delete", deleteResult);

    if (deleteResult && deleteResult.deletedCount === 1) {
      res.redirect("/tags/?msg=Deleted");
    } else {
      res.redirect("/tags/?msg=Error Deleting");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/createTag", async (req, res, next) => {
  const tag = req.body;

  try {
    const insertTag = await myDb.insertTag(tag);

    console.log("Inserted", insertTag);
    res.redirect("/tags/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.get("/users", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getUsersCount(query);
    let users = await myDb.getUsers(query, page, pageSize);
    console.log({ users });
    console.log({ total });
    res.render("./pages/users", {
      users,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/users/:user_id/delete", async (req, res, next) => {
  const user_id = req.params.user_id;
  try {
    await myDb.deleteUserByID(user_id);
    res.redirect("/users");
  } catch (err) {
    next(err);
  }
});

router.post("/createUser", async (req, res, next) => {
  const user = req.body;

  try {
    const insertUser = await myDb.insertUser(user);

    console.log("Inserted", insertUser);
    res.redirect("/users/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;
