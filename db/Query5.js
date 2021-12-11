// get all the tasks that are of hign or medium priority and due on Sep 2021
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
      $and: [
        {
          $or: [
            {
              priority: "hign",
            },
            {
              priority: "medium",
            },
          ],
        },
        {
          dueDate: {
            $gte: new Date("Wed, 01 Sep 2021 00:00:00 GMT"),
            $lt: new Date("Fri, 01 Oct 2021 00:00:00 GMT"),
          },
        },
      ],
    };

    const task = await taskCollection.find(filter).toArray();

    console.log(task);

    return task;
  } finally {
    await client.close();
  }
}

module.exports.getTask = getTask;

getTask();
