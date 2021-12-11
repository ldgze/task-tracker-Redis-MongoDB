// get the number of tasks of different tags
const { MongoClient } = require("mongodb");

async function getCount() {
  let db, client;

  try {
    const url = "mongodb://localhost:27017";

    client = new MongoClient(url);

    await client.connect();

    console.log("Connected to Mongo Server");

    db = client.db("task");

    const tagCollection = db.collection("tag");

    const agg = [
      {
        $lookup: {
          from: "task",
          localField: "_id",
          foreignField: "tag",
          as: "task",
        },
      },
      {
        $unwind: {
          path: "$task",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          count: {
            $sum: 1,
          },
          name: {
            $last: "$name",
          },
        },
      },
    ];

    const tag = await tagCollection.aggregate(agg).toArray();

    console.log(tag);

    return tag;
  } finally {
    await client.close();
  }
}

module.exports.getCount = getCount;

getCount();
