// How many tasks are assigned to each user?
const { MongoClient } = require("mongodb");

async function countAssigned() {
  let db, client;

  try {
    const url = "mongodb://localhost:27017";

    client = new MongoClient(url);

    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("task");

    const taskCollection = db.collection("user");

    const agg = [
      {
        $lookup: {
          from: "task",
          localField: "_id",
          foreignField: "assignee",
          as: "assignedTasks",
        },
      },
      {
        $unwind: {
          path: "$assignedTasks",
        },
      },
      {
        $group: {
          _id: "$_id",
          count: {
            $sum: 1,
          },
          userID: {
            $last: "$userID",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];

    const countAssigned = await taskCollection.aggregate(agg).toArray();

    console.log(countAssigned);
  } finally {
    await client.close();
  }
}

module.exports.countAssigned = countAssigned;

countAssigned();
