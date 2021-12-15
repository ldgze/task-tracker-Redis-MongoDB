const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "task";
const COL_NAME = "task";

async function getTasks(query, page, pageSize) {
  console.log("getTasks", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      title: { $regex: `^${query}`, $options: "i" },
    };

    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .find(queryObj)
      .sort({ createDate: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();
  } finally {
    client.close();
  }
}

async function getTasksCount(query) {
  console.log("getTasksCount", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      title: { $regex: `^${query}`, $options: "i" },
    };

    return await client.db(DB_NAME).collection(COL_NAME).find(queryObj).count();
  } finally {
    client.close();
  }
}

async function getTaskByID(task_id) {
  console.log("getTaskByID", task_id);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(task_id),
    };

    return await client.db(DB_NAME).collection(COL_NAME).findOne(queryObj);
  } finally {
    client.close();
  }
}

async function updateTaskByID(task_id, task) {
  console.log("updateTaskByID", task_id, task);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(task_id),
    };

    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(queryObj, { $set: task });
  } finally {
    client.close();
  }
}

async function finishTaskByID(task_id) {
  console.log("finishTaskByID", task_id);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(task_id),
    };

    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(queryObj, {
        $set: {
          status: "done",
        },
      });
  } finally {
    client.close();
  }
}

async function deleteTaskByID(task_id) {
  console.log("deleteTaskByID", task_id);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(task_id),
    };

    return await client.db(DB_NAME).collection(COL_NAME).remove(queryObj);
  } finally {
    client.close();
  }
}

async function insertTask(task) {
  const client = new MongoClient(uri);
  var createDate = new Date();

  try {
    await client.connect();

    return await client.db(DB_NAME).collection(COL_NAME).insertOne({
      title: task.title,
      createDate: createDate,
      dueDate: task.dueDate,
      URL: task.URL,
      priority: task.priority,
      status: "todo",
    });
  } finally {
    client.close();
  }
}

async function getTagsByTaskID(task_id) {
  console.log("getTagsByTaskID", task_id);

  const client = new MongoClient(uri);

  const agg = [
    {
      $match: {
        _id: new ObjectId(task_id),
      },
    },
    {
      $lookup: {
        from: "tag",
        localField: "tag",
        foreignField: "_id",
        as: "tagArray",
      },
    },
    {
      $project: {
        _id: 0,
        tagArray: 1,
      },
    },
    {
      $unwind: {
        path: "$tagArray",
      },
    },
    {
      $replaceRoot: {
        newRoot: "$tagArray",
      },
    },
  ];

  try {
    await client.connect();
    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .aggregate(agg)
      .toArray();
  } finally {
    client.close();
  }
}

async function addTagIDToTaskID(task_id, tag_id) {
  console.log("addTagIDToTaskID", task_id, tag_id);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(
        { _id: new ObjectId(task_id) },
        { $push: { tag: new ObjectId(tag_id) } }
      );
  } finally {
    client.close();
  }
}

async function removeTagIDFromTaskID(task_id, tag_id) {
  console.log("removeTagIDFromTaskID", task_id, tag_id);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(
        { _id: new ObjectId(task_id) },
        { $pull: { tag: new ObjectId(tag_id) } }
      );
  } finally {
    client.close();
  }
}

async function getTags(query, page, pageSize) {
  console.log("getTags", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      name: { $regex: `^${query}`, $options: "i" },
    };

    return await client
      .db(DB_NAME)
      .collection("tag")
      .find(queryObj)
      .sort({ name: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();
  } finally {
    client.close();
  }
}

async function getTagsCount(query) {
  console.log("getTagsCount", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      name: { $regex: `^${query}`, $options: "i" },
    };

    return await client.db(DB_NAME).collection("tag").find(queryObj).count();
  } finally {
    client.close();
  }
}

async function deleteTagByID(tag_id) {
  console.log("deleteTagByID", tag_id);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(tag_id),
    };

    return await client.db(DB_NAME).collection("tag").remove(queryObj);
  } finally {
    client.close();
  }
}

async function insertTag(tag) {
  console.log("insertTag", tag);
  const client = new MongoClient(uri);

  try {
    await client.connect();

    return await client.db(DB_NAME).collection("tag").insertOne({
      name: tag.name,
    });
  } finally {
    client.close();
  }
}

module.exports.getTasks = getTasks;
module.exports.getTasksCount = getTasksCount;
module.exports.insertTask = insertTask;
module.exports.getTaskByID = getTaskByID;
module.exports.updateTaskByID = updateTaskByID;
module.exports.deleteTaskByID = deleteTaskByID;
module.exports.getTagsByTaskID = getTagsByTaskID;
module.exports.addTagIDToTaskID = addTagIDToTaskID;
module.exports.removeTagIDFromTaskID = removeTagIDFromTaskID;
module.exports.getTags = getTags;
module.exports.getTagsCount = getTagsCount;
module.exports.deleteTagByID = deleteTagByID;
module.exports.insertTag = insertTag;
module.exports.finishTaskByID = finishTaskByID;
