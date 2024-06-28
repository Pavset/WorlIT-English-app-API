
![Logo](https://i.ibb.co/Xtm0zTf/Frame-113.png)


# API For World IT English
### [Database Structure](https://www.figma.com/board/ErOJZwu5ySTPJHghzrkTz3/Untitled?node-id=0-1&t=vJpjBLJrGrVonNJ9-1)
World IT English — is an API for managing World IT's English course. The API is developed using Node.js and Express.js. The database is developed using Node.js, Postgres and Sequelize.

## Table of Contents
- [Installation](#installation)
- [DataBase Schema](#database-schema)
- [Relationships](#relationships)
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

5. Run your project

```bash
 node index.js  # Or you can use nodemon index.js
```

## Database Schema

The database schema for "World It English" project is managed using Sequelize. Below is a table of the main models:

| Table Name      | Fields                                                                                     |
|-----------------|--------------------------------------------------------------------------------------------|
| **User**        | `name`, `surname`, `email`, `yearsOld`, `password`, `phoneNumber`, `address`, `apikey`, `completedTasks`, `course` |
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

### Relationships

- **User - Courses:** A user belongs to a course.
- **Courses - Staff:** A course is managed and taught by staff.
- **Modules - Topics:** A module contains multiple topics.
- **Tasks - Users:** Many-to-many relationship through `TasksUsers`.
- **Questions - Users:** Many-to-many relationship through `QuestionUsers`.
- **Words - Users:** Many-to-many relationship through `UsersWords`.
- **Theories - Sections:** A theory has many sections.
- **Modules - Courses:** Many-to-many relationship through `ModuleCourse`.

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

#### Get word counters

```http
  PUT /wordCounters
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API Key |


| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

**Response:**
- `200 OK` - Returns user words.
- `404 Not Found` - Missing user words.
- `403 Forbidden` - Missing or invalid token.

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
