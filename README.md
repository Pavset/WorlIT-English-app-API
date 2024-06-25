
![Logo](https://i.ibb.co/Xtm0zTf/Frame-113.png)


# API For World IT English
### [Database Structure](https://www.figma.com/board/ErOJZwu5ySTPJHghzrkTz3/Untitled?node-id=0-1&t=vJpjBLJrGrVonNJ9-1)
World IT English — is an API for managing World IT's English course. The API is developed using Node.js and Express.js. The database is developed using Node.js, Postgres and Sequelize.

## Table of Contents
- [Installation](#installation)
- [API Reference](#api-reference)
- [Authors](#authors)
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

## API Reference

#### Get your account and course information

```http
  GET /account
```

| Headers | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Required**. Your API key |

#### Get all modules

```http
  GET /modules
```

#### Login

```http
  POST /signin
```
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Your name |
| `password` | `string` | **Required**. Your password |

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

#### Get completed task by ID

```http
  GET /taskProgress/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id of item to fetch |

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


## 😊 Thanks to these technologies!
![JS](https://skillicons.dev/icons?i=js) **JavaScript** — A versatile programming language used primarily for web development to create interactive and dynamic content.

![SQ](https://skillicons.dev/icons?i=sequelize) **Sequelize** — An ORM (Object-Relational Mapping) library for Node.js that facilitates database operations with SQL-based databases.

![PSQL](https://skillicons.dev/icons?i=postgres) **Postgres** — A powerful, open-source relational database system known for its robustness and scalability.

![EX](https://skillicons.dev/icons?i=express) **Express** — A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

![NPM](https://skillicons.dev/icons?i=npm) **NPM** — A package manager for JavaScript that allows developers to install, share, and manage dependencies in their projects.

![GITHUB](https://skillicons.dev/icons?i=github) **GitHub** — A web-based platform that uses Git for version control and provides hosting for software development and collaboration.

![GIT](https://skillicons.dev/icons?i=git) **Git** — A distributed version control system that helps track changes in source code during software development.


## Authors
- [@Pavset](https://github.com/Pavset)
- [@dimasribnyj14](https://www.github.com/dimasribnyj14)
- [@NaruChigo31](https://github.com/NaruChigo31)
- [@alex21000211](https://github.com/alex21000211)
