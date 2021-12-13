# task-tracker-MongoDB overview

An application that lets the users organize and manage tasks.

We will build a task tracker that lets the users organize and manage tasks. We need to design a database to store the data, with the following requirements:

## Basic:

We’ll have 6 classes in the UML:

-   Task
-   List
-   Tag
-   Subtask
-   User
-   Comment

There will be many to many relationships (task-tag) and one to many (user- task, list-task, task-comment, task-subtask) relationships between the classes.

## Part 1: task-user-tags: Dongze Li

-   Each task has a title, due date, create date, and status. Users can add the URL and a priority to the task.
-   Each user has a userID, first name, last name, and email. Users can create tasks, finish tasks, delete tasks.
-   Users can assign tasks to another user. The default assignee of the task is the creator.
-   The task has two kinds of status: todo and done.
-   Each task can have 0 or more tags. Each tag has a name. Each tag can also be added to 0 or more tasks

## Part 2: task-list-subtask-comment: Shuyi Wang

-   The assignee can make multiple comments on the task.
-   Each Comment has an update time and a content. The task can have 0 or more comments.
-   Each List has a name. The tasks can be moved to a list. The list can have 0 or more tasks.
-   Each task can have 0 or more subtasks. The subtask has the name and status of either todo or done.

## Others:

-   The app will support filters such as the “Unscheduled work tasks”, “Important tasks in the next 2 weeks”, "Older than a month", "assigned to me" and so on, which demands queries contain a join of at least three tables, subquery, and complex search criterion.
-   The app will also have a reporting feature to analyze the number of finished tasks grouped by list, or month, which will demand queries using the clause of "GROUP BY", "HAVING" and “PARTITION BY ”.
-   [Requirements document](https://github.com/ldgze/task-tracker/blob/main/A.%20Requirements%20Document.pdf)

## UML

![image](https://github.com/ldgze/task-tracker-MongoDB/blob/main/B.%20UML.png)

## ERD

![image](https://github.com/ldgze/task-tracker-MongoDB/blob/main/C.%20ERD.png)

## Definition of Documents/Collections/Tables as example JSON objects.

-   The collection of task:

```
{
  "_id": {
    "$oid": "619d55bb5b3062fb52663b88"
  },
  "taskID": 1,
  "title": "Brainstorm Meeting",
  "dueDate": {
    "$date": "2021-02-11T08:00:00Z"
  },
  "createDate": {
    "$date": "2021-01-26T08:00:00Z"
  },
  "priority": "high",
  "status": "done",
  "list": {
    "listID": "1",
    "name": "project"
  },
  "comment": [
    {
      "commentID": 1,
      "content": "several Disney characters or just one",
      "updateAt": {
        "$date": "2021-01-31T08:00:00Z"
      }
    }
  ],
  "subtask": [
    {
      "subtaskID": 1,
      "title": "Select topic",
      "status": "done"
    },
    {
      "subtaskID": 2,
      "title": "Select presentation style",
      "status": "done"
    }
  ],
  "creator": {
    "$oid": "619eb57e36b435bf0941af10"
  },
  "tag": [
    {
      "$oid": "619efb0636b435bf0941af3b"
    },
    {
      "$oid": "619efb3836b435bf0941af3c"
    }
  ],
  "assignee": {
    "$oid": "619eb57e36b435bf0941af10"
  }
}
```

-   The collection of user:

```
{
  "_id": {
    "$oid": "619eb57e36b435bf0941af10"
  },
  "email": "mfarnell0@independent.co.uk",
  "firstName": "Marrilee",
  "lastName": "Farnell",
  "userID": 1
}
```

-   The collection of tag:

```
{
  "_id": {
    "$oid": "619efb0636b435bf0941af3b"
  },
  "name": "personal",
  "tagID": 1
}
```

## Initialization files for the database containing the mockup data in CSV or Extended JSON format.

-   [task.json](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/task.json)

-   [user.json](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/user.json)

-   [tag.json](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/tag.json)

## Instructions on how to initialize the database.

-   Start the mongoDB localhost server

```
brew services start mongodb-community
```

-   Import the initialization files

```
mongoimport --db task --collection task --type json --file ./db/task.json --jsonArray
```

```
mongoimport --db task --collection user --type json --file ./db/user.json --jsonArray
```

```
mongoimport --db task --collection tag --type json --file ./db/tag.json --jsonArray
```

## Define and execute at least five queries that show your database.

To execute the query:

```
node db/Query1.js
```

-   [Query1.js](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/Query1.js): How many tasks are assigned to each user?

-   [Query2.js](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/Query2.js): Set the task of specifc taskID as finished.

-   [Query3.js](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/Query3.js): Get the top ten unfinished tasks of high priority，sorted with the create date.

-   [Query4.js](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/Query4.js): Get the number of tasks of different tags.

-   [Query5.js](https://github.com/ldgze/task-tracker-MongoDB/blob/main/db/Query5.js): Get all the tasks that are of hign or medium priority and due on Sep 2021

# Implementation of the task-tracker nodeExpressMongoDBEJS Application

An Application Using Node + Expres + MongoDB + EJS implementing a simple task manager

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
