// get the top ten unfinished tasks of high priority，sorted with the create date.
const { MongoClient } = require("mongodb");

async function getTask() {
  let db, client;

  try {
    const url = "mongodb://localhost:27017";

    client = new MongoClient(url);

    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("task");

    const taskCollection = db.collection("task");

    const filter = {
      status: "todo",
      priority: "high",
    };
    const projection = {
      taskID: 1,
      title: 1,
      createDate: 1,
      dueDate: 1,
    };
    const sort = {
      dueDate: 1,
    };
    const limit = 10;

    const task = await taskCollection
      .find(filter, {
        projection: projection,
        sort: sort,
        limit: limit,
      })
      .toArray();

    console.log(task);

    return task;
  } finally {
    await client.close();
  }
}

module.exports.getTask = getTask;

getTask();
