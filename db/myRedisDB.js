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

async function updateUser(
  userID,
  firstName,
  lastName,
  email,
  numberOfAccomplishedTask
) {
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

module.exports.getUser = getUser;
module.exports.insertUser = insertUser;
module.exports.updateUser = updateUser;
module.exports.getUsers = getUsers;
module.exports.deleteUserByID = deleteUserByID;
