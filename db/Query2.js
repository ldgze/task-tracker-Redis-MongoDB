// set the task of specifc taskID as finished
const { MongoClient } = require("mongodb");

async function setFinish(taskID) {
  let db, client;

  try {
    const url = "mongodb://localhost:27017";

    client = new MongoClient(url);

    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("task");

    const taskCollection = db.collection("task");

    const query = { taskID: taskID };
    const update = {
      $set: {
        status: "done",
      },
    };
    const options = { upsert: false };
    await taskCollection
      .updateOne(query, update, options)
      .then((result) => {
        const { matchedCount, modifiedCount } = result;
        if (matchedCount && modifiedCount) {
          console.log(`Successfully set the task as finished.`);
        }
      })
      .catch((err) =>
        console.error(`Failed to set the task as finished: ${err}`)
      );
  } finally {
    await client.close();
  }
}

module.exports.setFinish = setFinish;

setFinish(6);
