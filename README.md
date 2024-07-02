
![Logo](https://i.ibb.co/Xtm0zTf/Frame-113.png)


# API For World IT English
### [Database Structure](https://www.figma.com/board/ErOJZwu5ySTPJHghzrkTz3/Untitled?node-id=0-1&t=vJpjBLJrGrVonNJ9-1)
World IT English — is an API for managing World IT's English course. The API is developed using Node.js and Express.js. The database is developed using Node.js, Postgres and Sequelize.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [DataBase Schema](#database-schema)
- [Relationships](#relationships)
- [Functions](#functions)
- [API Reference](#api-reference)
- [Technologies](#-thanks-to-these-technologies)
- [Authors](#authors)
- [License](#license)
## Installation
1. Clone the repository:
```bash
 git clone https://github.com/Pavset/WorlIT-English-app.git
```

2. Install dependencies:
```bash
 npm install
```
    
3. Create your PSQL database and put your url to the new sequelize

```js
const sequelize = new Sequelize(YOUR_URL, {
    dialect: "postgres",
})
```

4. Input your port to start server **(Mostly recommended stay at 8000)**

```js
router.listen(YOUR_PORT, () => {console.log('Server is running on',port)})
```

5. Input your telegram token here

```js
const bot = new Telegraf(YOUR_TELEGRAM_TOKEN)
```

6. Input your telegram user id here

```js
bot.telegram.sendMessage(YOUR_TELEGRAM_USER_ID,`Новий користувач зареєструвався:\n
        · Імя: ${body.name}\n
        · Прізвище: ${body.surname}\n
        · Кількість років: ${body.age}\n
        · Пошта: ${body.email}\n
        · Адреса: ${body.address}\n
        · Номер телефону: ${body.phone}\n`)
```

7. Run your project

```bash
 node index.js  # Or you can use nodemon index.js
```

## Features
- After registration, `admin-user` gets a message about it by telegram bot
- Uses `CRUD` for admin-panels *(not always)*
- Uses static files in folder: `public`
- Uses relationships through other tables
- Uses `uuid` to generate API tokens
- And more...

## Database Schema

The database schema for "World It English" project is managed using Sequelize. Below is a table of the main models:

| Table Name      | Fields                                                                                     |
|-----------------|--------------------------------------------------------------------------------------------|
| **User**        | `name`, `surname`, `email`, `yearsOld`, `password`, `phoneNumber`, `address`, `apikey`, `completedTasks`, `course`,`isAdmin` |
| **Courses**     | `name`, `teacher`, `manager`                                                               |
| **Modules**     | `name`                                                                                     |
| **Topics**      | `mainName`, `name`, `tasks`, `homework`, `theories`, `module`                              |
| **Sections**    | `text`, `title`, `imagePath`, `theory`                                                     |
| **Theories**    | `name`                                                                                     |
| **Tasks**       | `type`, `audio`, `video`, `wordArray`, `initialyBlocked`, `unlockingTaskId`                |
| **TasksUsers**  | `blocked`, `completed`, `progress`                                                         |
| **QuestionUsers** | `correct`                                                                                  |
| **UsersWords**  | `counter`                                                                                  |
| **WordList**    | `name`                                                                                     |
| **Word**        | `word`, `translated`, `list`, `role`                                                       |
| **Question**    | `question`, `questionType`, `imagePath`, `trueAnswers`, `wrongAnswers`, `extraQuestionText`, `taskId`, `wordId` |
| **Staff**       | `name`, `surname`, `image`, `phone`, `tg`, `viber`                                         |

## Relationships

- **User - Courses:** A user belongs to a course.
- **Courses - Staff:** A course is managed and taught by staff.
- **Modules - Topics:** A module contains multiple topics.
- **Tasks - Users:** Many-to-many relationship through `TasksUsers`.
- **Questions - Users:** Many-to-many relationship through `QuestionUsers`.
- **Words - Users:** Many-to-many relationship through `UsersWords`.
- **Theories - Sections:** A theory has many sections.
- **Modules - Courses:** Many-to-many relationship through `ModuleCourse`.

## Functions

#### createTasksWithStatus

The `createTasksWithStatus` function initializes tasks, questions, and words for a user identified by their API key. It ensures that each user has a record in the many-to-many linking tables for tasks, questions, and words, initializing these records if they do not already exist.

```javascript
async function createTasksWithStatus(apikey) {
    let tasks = await Tasks.findAll()
    let questions = await Question.findAll()
    let words = await Word.findAll()
    let user = await User.findOne({
        where: {
            apikey: apikey
        }
    })
    for (let task of tasks){
        let data = await TasksUsers.findAll({
            where:{
                UserId: user.id,
                TaskId: task.id,
            }
        })
        if (data.length <= 0){
            let block = false
            if(task.initialyBlocked){
                block = true
            }
            let MtM = await TasksUsers.create({
                UserId: user.id,
                TaskId: task.id,
                blocked: block,
                completed: false,
                progress: 1
            })
        }
    }
    for (let question of questions){
        let data = await QuestionUsers.findAll({
            where:{
                UserId: user.id,
                QuestionId: question.id,
            }
        })
        if (data.length <= 0){
            let QuQ = await QuestionUsers.create({
                UserId: user.id,
                QuestionId: question.id,
                correct: false
            })
        }

    }
    for(let word of words){
        let data = await UsersWords.findAll({
            where:{
                UserId: user.id,
                WordId: word.id,
            }
        })

        if (data.length <= 0){
            let QuQ = await UsersWords.create({
                UserId: user.id,
                WordId: word.id,
                counter: 1
            })
        }
    }
}
```

#### isAdminCheck

The `isAdminCheck` function verifies whether a user identified by their API key has administrative privileges. It ensures that only users with admin rights can access certain actions.
> Use this function to restrict access to administrative functions and ensure that only users with the necessary privileges can perform certain actions.

```javascript
async function isAdminCheck(apikey, res){
    let you = await User.findOne({
        where:{
            apikey: apikey
        }
    });
    if(you){
        if(!you.dataValues.isAdmin){
            return res.status(404).json({error: "У вас немає прав Адміна"});
        }  
    } else{
        return res.status(403).json({error: "Такого юзера немаэ"});
    }
}
```

## API Reference

#### Get your account and course information

```http
  GET /account
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API key |

**Response:**
- `200 OK` - Returns user and course data.
- `403 Forbidden` - Missing token or didn't join to course group.

#### Get all modules

```http
  GET /modules
```

**Response:**
- `200 OK` - Returns modules data.
- `404 Not Found` - Missing modules.

#### Login

```http
  POST /signin
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your name |
| `password` | `string` | **Required**. Your password |

**Response:**
- `200 OK` - Returns user's apikey.
- `400 Bad Request` - Empty or incorrect name or password.

#### Register

```http
  POST /signup
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your name |
| `surname` | `string` | **Required**. Your surname |
| `age` | `integer` | **Required**. Your age |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |
| `address` | `string` | **Required**. Your address |
| `phone` | `string` | **Required**. Your phone number |

**Response:**
- `201 OK` - Returns user's apikey.
- `400 Bad Request` - Empty some data.

#### Get module by ID

```http
  GET /modules/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns module and his tasks data.
- `404 Not Found` - Missing module or his data.
- `403 Forbidden` - Missing token or access to module.

#### Get theory by ID

```http
  GET /theories/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns theory and his sections data.
- `404 Not Found` - Missing theory or his data.
- `403 Forbidden` - Missing token or access to theory.

#### Get task by ID

```http
  GET /tasks/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns task and his data.
- `404 Not Found` - Missing task or his data.
- `403 Forbidden` - Missing token or access to task.

#### Get progress task by ID

```http
  GET /taskProgress/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns progress task.
- `404 Not Found` - Missing task

#### Put progress task by ID

```http
  PUT /taskProgress/${id}/${progressValue}/${isCorrect}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |
| `progressValue` | `integer` | **Required**. New value of progress |
| `isCorrect` | `bool` | **Required**. Correct (or not) answer |

**Response:**
- `200 OK` - Returns progress task.
- `400 Bad Request` - Invalid status task.
- `404 Not Found` - Missing task.
- `403 Forbidden` - Missing or invalid token.

#### Put complete task by ID

```http
  PUT /complete/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns completed and unlocked tasks.
- `404 Not Found` - Missing task and his progress.
- `403 Forbidden` - Missing or invalid token.

#### Get word counters by Id

```http
  PUT /wordCounters/${wordListId}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `wordListId` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns user words.
- `404 Not Found` - Missing user words.
- `403 Forbidden` - Missing or invalid token.

#### Get user by Id

```http
  GET /user/${userId}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns user.
- `404 Not Found` - Missing user.
- `403 Forbidden` - Missing or invalid admin token.

#### Remove user by Id

```http
  DELETE /user/${userId}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `404 Not Found` - Missing user.
- `403 Forbidden` - Missing or invalid admin token.

#### Get users

```http
  GET /users
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

**Response:**
- `200 OK` - Returns users.
- `404 Not Found` - Missing users.
- `403 Forbidden` - Missing or invalid admin token.

#### Put user's course by Id

```http
  GET /user/${userId}/course/${courseId}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `courseId` | `integer` | **Required**. Id of item to fetch |
| `userId` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `404 Not Found` - Missing user or course.
- `403 Forbidden` - Missing or invalid admin token.

#### Get staff by Id

```http
  GET /staff/${staffId}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `staffId` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns staff.
- `404 Not Found` - Missing staff.
- `403 Forbidden` - Missing or invalid admin token.

#### Get staffs

```http
  GET /staff
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

**Response:**
- `200 OK` - Returns staffs.
- `404 Not Found` - Missing staffs.
- `403 Forbidden` - Missing or invalid admin token.

#### Post staff

```http
  POST /staff
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your name |
| `surname` | `string` | **Required**. Your surname |
| `tg` | `string` | **Required**. Your telegram link to user |
| `viber` | `string` | **Required**. Your viber link to user |
| `imagePath` | `string` | **Required**. Your image path |
| `phone` | `string` | **Required**. Your phone number |

**Response:**
- `201 Created` - Returns staff.
- `400 Bad Request` - Missing or incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.

#### Put staff by Id

```http
  PUT /staff/${staffId}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `staffId` | `integer` | **Required**. Id of item to fetch |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | Your name |
| `surname` | `string` | Your surname |
| `tg` | `string` | Your telegram link to user |
| `viber` | `string` | Your viber link to user |
| `imagePath` | `string` | Your image path |
| `phone` | `string` | Your phone number |

**Response:**
- `200 OK` - Returns staff.
- `400 Bad Request` - Incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing staff.

#### Delete staff by Id

```http
  DELETE /staff/${staffId}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `staffId` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing staff.

#### Get course by Id

```http
  GET /course/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns course.
- `404 Not Found` - Missing course.
- `403 Forbidden` - Missing or invalid admin token.

#### Get courses

```http
  GET /course
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

**Response:**
- `200 OK` - Returns courses.
- `404 Not Found` - Missing courses.
- `403 Forbidden` - Missing or invalid admin token.

#### Post course

```http
  POST /course
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your name |
| `teacher` | `integer` | **Required**. Your staff Id |
| `manager` | `integer` | **Required**. Your staff Id |

**Response:**
- `201 Created` - Returns staff.
- `400 Bad Request` - Missing or incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.

#### Put course by Id

```http
  PUT /course/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | Your name |
| `teacher` | `integer` | Your staff Id |
| `manager` | `integer` | Your staff Id |

**Response:**
- `200 OK` - Returns course.
- `400 Bad Request` - Incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing course.

#### Delete course by Id

```http
  DELETE /course/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing course.

#### Get module by Id

```http
  GET /module/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns module and his topics.
- `404 Not Found` - Missing module.
- `403 Forbidden` - Missing or invalid admin token.

#### Post module

```http
  POST /module
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your module name |

**Response:**
- `201 Created` - Returns staff.
- `400 Bad Request` - Missing or incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.

#### Put module by Id

```http
  PUT /module/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | Your module name |


**Response:**
- `200 OK` - Returns course.
- `400 Bad Request` - Incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing course.

#### Delete module by Id

```http
  DELETE /module/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing module.

#### Get theory by Id

```http
  GET /theory/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns theory.
- `404 Not Found` - Missing theory and his sections.
- `403 Forbidden` - Missing or invalid admin token.

#### Post theory

```http
  POST /theory
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your module name |
| `topicId` | `integer` | **Required**. Your topic id |

**Response:**
- `201 Created` - Returns theory.
- `400 Bad Request` - Missing or incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.

#### Put theory by Id

```http
  PUT /theory/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | Your theory name |

**Response:**
- `200 OK` - Returns theory.
- `400 Bad Request` - Incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing theory.

#### Delete theory by Id

```http
  DELETE /theory/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing theory.

#### Post section

```http
  POST /section
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | Your title |
| `text` | `string` | Your text |
| `imagePath` | `string` | Your image url |
| `theory` | `integer` | **Required**. Your theory id |

**Response:**
- `201 Created` - Returns section.
- `400 Bad Request` - Missing or incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.

#### Put section by Id

```http
  PUT /section/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | Your title |
| `text` | `string` | Your text |
| `imagePath` | `string` | Your image url |

**Response:**
- `200 OK` - Returns section.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing section.

#### Delete section by Id

```http
  DELETE /section/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing section.

#### Get task by Id

```http
  GET /task/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns task (and maybe also his questions).
- `404 Not Found` - Missing task.
- `403 Forbidden` - Missing or invalid admin token.

#### Post task

```http
  POST /task
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `type` | `string` | **Required**. Your type of task (words, routes, audio, video, test, sentence) |
| `wordArray` | `integer` | **Required**. Your word array id |
| `topicId` | `integer` | **Required**. Your topic id |
| `notHomework` | `boolean` | **Required**. Is task homework |
| `video` | `string` | **Required if type is "video"**. Your video url |
| `audio` | `string` | **Required if type is "audio"**. Your audio url |

**Response:**
- `201 Created` - Returns task and his topic.
- `400 Bad Request` - Missing or incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.

#### Post question

```http
  POST /question
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `taskId` | `integer` | **Required**. Your task id |
| `trueAnswers` | `string[]` | **Required**. Your true answers |
| `questionType` | `string` | **Required**. Your question type (word, multiple, input) |
| `question` | `string` | Your question |
| `extraQuestionText` | `string` | Your extra question text |
| `imagePath` | `string` | Your image path |
| `wrongAnswers` | `string[]` | Your image path |

**Response:**
- `201 Created` - Returns question.
- `400 Bad Request` - Missing or incorrect body information.
- `403 Forbidden` - Missing or invalid admin token.

#### Delete question by Id

```http
  DELETE /question/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `203 Non-Authoritative Information` - Returns success.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing question.

#### Put question by Id

```http
  PUT /question/${id}
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your Admin API Key |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `trueAnswers` | `string[]` | Your true answers |
| `questionText` | `string` | Your question |
| `extraQuestionText` | `string` | Your extra question text |
| `imagePath` | `string` | Your image path |
| `wrongAnswers` | `string[]` | Your image path |

**Response:**
- `200 OK` - Returns success and question.
- `403 Forbidden` - Missing or invalid admin token.
- `404 Not Found` - Missing question.

## 😊 Thanks to these technologies!

| Techs      | Description                                                                                     |
|-----------------|--------------------------------------------------------------------------------------------|
| ![JS](https://skillicons.dev/icons?i=js)        | **JavaScript** — A versatile programming language used primarily for web development to create interactive and dynamic content. |
| ![SQ](https://skillicons.dev/icons?i=sequelize)     | **Sequelize** — An ORM (Object-Relational Mapping) library for Node.js that facilitates database operations with SQL-based databases.                                                               |
| ![PSQL](https://skillicons.dev/icons?i=postgres)     | **Postgres** — A powerful, open-source relational database system known for its robustness and scalability.                                                                                     |
| ![EX](https://skillicons.dev/icons?i=express)      | **Express** — A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.                              |
| ![NPM](https://skillicons.dev/icons?i=npm)    | **NPM** — A package manager for JavaScript that allows developers to install, share, and manage dependencies in their projects.                                                     |
| ![GITHUB](https://skillicons.dev/icons?i=github)    | **GitHub** — A web-based platform that uses Git for version control and provides hosting for software development and collaboration.                                                                                     |
| ![GIT](https://skillicons.dev/icons?i=git)       | **Git** — A distributed version control system that helps track changes in source code during software development.                |

## Authors
- [@Pavset](https://github.com/Pavset)
- [@dimasribnyj14](https://www.github.com/dimasribnyj14)
- [@NaruChigo31](https://github.com/NaruChigo31)
- [@alex21000211](https://github.com/alex21000211)

## License

[MIT](https://choosealicense.com/licenses/mit/)
