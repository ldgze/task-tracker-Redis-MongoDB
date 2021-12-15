const { createClient } = require("redis");

async function getRConnection() {
  let rclient = createClient();
  rclient.on("error", (err) => console.log("Redis Client Error", err));
  await rclient.connect();

  console.log("redis connected");
  return rclient;
}

async function getUser(userId) {
  let rclient;
  try {
    rclient = await getRConnection();

    const user = await rclient.hGetAll(`${userId}`);
    const numberOfAccomplishedTask = await rclient.ZSCORE("users", `${userId}`);
    user.numberOfAccomplishedTask = numberOfAccomplishedTask;

    return user;
  } finally {
    rclient.quit();
  }
}

async function getList(listId) {
  let rclient;
  try {
    rclient = await getRConnection();

    const list = await rclient.hGetAll(`${listId}`);
    const numberOfViews = await rclient.ZSCORE("lists", `${listId}`);
    list.numberOfViews = numberOfViews;

    return list;
  } finally {
    rclient.quit();
  }
}

async function insertUser(
  firstName,
  lastName,
  email,
  numberOfAccomplishedTask
) {
  let rclient;

  try {
    rclient = await getRConnection();

    const nextId = await rclient.incr("userCount");

    console.log(
      "insertUser",
      firstName,
      lastName,
      email,
      numberOfAccomplishedTask
    );

    const key = `user:${nextId}`;

    await rclient.hSet(key, {
      id: nextId,
      firstName: firstName,
      lastName: lastName,
      email: email,
    });

    //await rclient.rPush("userslist", key);
    await rclient.ZADD("users", {
      score: `${numberOfAccomplishedTask}`,
      value: key,
    });
  } finally {
    rclient.quit();
  }
}

async function insertList(listName, numberOfViews) {
  let rclient;

  try {
    rclient = await getRConnection();

    const nextId = await rclient.incr("listCount");

    console.log("insertList", listName, numberOfViews);

    const key = `list:${nextId}`;

    await rclient.hSet(key, {
      id: nextId,
      listName: listName,
    });

    await rclient.ZADD("lists", {
      score: `${numberOfViews}`,
      value: key,
    });
  } finally {
    rclient.quit();
  }
}

async function updateUser(userID, user) {
  let rclient;

  try {
    rclient = await getRConnection();

    console.log(
      "updateUser",
      firstName,
      lastName,
      email,
      numberOfAccomplishedTask
    );

    const key = `user:${userID}`;

    await rclient.hSet(key, {
      id: userID,
      firstName: firstName,
      lastName: lastName,
      email: email,
    });

    await rclient.ZADD("users", {
      score: `${numberOfAccomplishedTask}`,
      value: key,
    });
  } finally {
    rclient.quit();
  }
}

async function getUsers() {
  let rclient;
  try {
    rclient = await getRConnection();

    const userIds = await rclient.ZRANGE("users", "+inf", "-inf", {
      BY: "SCORE",
      REV: true,
    });

    console.log("users userIds", userIds);

    const users = [];
    for (let uId of userIds) {
      const user = await getUser(uId);
      users.push(user);
    }

    return users;
  } finally {
    rclient.quit();
  }
}

async function getLists() {
  let rclient;
  try {
    rclient = await getRConnection();

    const listIds = await rclient.ZRANGE("lists", "+inf", "-inf", {
      BY: "SCORE",
      REV: true,
    });

    console.log("lists listIds", listIds);

    const lists = [];
    for (let lId of listIds) {
      const list = await getList(lId);
      lists.push(list);
    }

    return lists;
  } finally {
    rclient.quit();
  }
}

async function deleteUserByID(userId) {
  let rclient;

  try {
    rclient = await getRConnection();

    const key = `user:${userId}`;
    await rclient.ZREM("users", key);
    await rclient.del(key);
  } finally {
    rclient.quit();
  }
}

async function deleteListByID(listId) {
  let rclient;

  try {
    rclient = await getRConnection();

    const key = `list:${listId}`;
    await rclient.ZREM("lists", key);
    await rclient.del(key);
  } finally {
    rclient.quit();
  }
}

module.exports.getUser = getUser;
module.exports.getList = getList;
module.exports.insertUser = insertUser;
module.exports.insertList = insertList;
module.exports.updateUser = updateUser;
module.exports.getUsers = getUsers;
module.exports.getLists = getLists;
module.exports.deleteUserByID = deleteUserByID;
module.exports.deleteListByID = deleteListByID;
