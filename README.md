# task-tracker-Redis-MongoDB overview

An application that lets the users organize and manage tasks.

We will build a task tracker that lets the users organize and manage tasks. We need to design a database to store the data, with the following requirements:

## Basic:

We’ll have 6 classes in the UML:

- Task
- List
- Tag
- Subtask
- User
- Comment

There will be many to many relationships (task-tag) and one to many (user- task, list-task, task-comment, task-subtask) relationships between the classes.

## Describe the functionalities that you selected to be used as an in-memory key-value storage:

- Leaderboard: Users finished the most tasks. CRUD supported.
- Leaderboard: The most viewed lists.

## Describe the Redis data structures that you are going to use to implement the functionalities you described in the previous point.

- To implement the user finished the most tasks, I will use a Redis sorted set with key "users", users ids as the values and a score of the number of the finished tasks of the users.
- To implement the most viewed lists I will use a Redis sorted set with key "lists", list ids as the values and a score of the number of views of the list.

## [Requirements document](https://github.com/ldgze/task-tracker/blob/main/A.%20Requirements%20Document.pdf)

## UML

![image](https://github.com/ldgze/task-tracker-MongoDB/blob/main/B.%20UML.png)

## ERD

![image](https://github.com/ldgze/task-tracker-MongoDB/blob/main/C.%20ERD.png)

## Initialization files for the database containing the mockup data in CSV or Extended JSON format.

- [task.json](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/task.json)

- [tag.json](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/tag.json)

## Instructions on how to initialize the database.

- Start the mongoDB localhost server

```
brew services start mongodb-community
```

- Import the initialization files

```
mongoimport --db task --collection task --type json --file ./db/task.json --jsonArray
```

```
mongoimport --db task --collection tag --type json --file ./db/tag.json --jsonArray
```

- Start the Redis Server

```
reids-server
```

# Implementation of the task-tracker nodeExpressMongoDBEJS Application

An Application Using Node + Expres + Redis + MongoDB + EJS implementing a simple task manager

## Using it

1. Clone the repo
2. Install the dependencies

```
npm install
```

3. Start the server

```
npm start
```

4. Point your browser to http://localhost:3000

5. In the browser (Or you can also point your browser to http://localhost:3000/tasks), you can overview the all listed tasks.

6. You can create a new task on the right column with title, dueDate, URL, and priority by clicking on the create button.

7. To edit, update, or delete the exist task; simply click on the button on exist tasks and enter the information or tags to the tasks at the next browser appear. (tasks and tags are linked)

8. To mark as finishing the task, simply click on finish button on the exist task.

9. You can search the exist tasks, tags, and lists at the search bar of each pages,

10. You can also add/delete tags or lists manually by clicking on the tag or list bar on the top of the browser. (Or you can also point your browser to http://localhost:3000/tags or http://localhost:3000/lists)
