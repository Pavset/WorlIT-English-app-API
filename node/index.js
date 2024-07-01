// Import Modules

const express = require('express')
const cors = require('cors');
const { User,Courses,Modules,Topics,Theories,Tasks,Question,Staff,Word,WordList,Sections,ModuleCourse,TasksUsers, QuestionUsers, UsersWords } = require("./db.js")
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const { Telegraf } = require('telegraf');
require('dotenv').config();

// Router

const bot = new Telegraf(`${process.env.TELEGRAMTOKEN}`)
const router = express()
const port = process.env.PORT
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());
router.use(express.static('public'))


// Auto Run Functions

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

async function isAdminCheck(apikey, res){
    let you = await User.findOne({
        where:{
            apikey: apikey
        }
    })
    if(you){
        if(!you.dataValues.isAdmin){
            return res.status(404).json({error: "У вас немає прав Адміна"})
        }  
    } else{
        return res.status(403).json({error: "Такого юзера немаэ"})
    }
}

// Check Connection

router.get("", async (req, res) => {
    return res.status(200).json({data: "Success"})
})

// User

router.get("/apikey", async (req, res) => {
    let data = await User.findOne({
        where: {
            apikey: req.headers.token,
        }
    })
    if(data){
        let course = await Courses.findOne({
            where: { 
                
                id: data.course,
            }
        })
        if (course){
            return res.status(200).json({data: data})
        }else{
            return res.status(403).json({error: "Неправильний токен"})
        }
    } else{
        return res.status(403).json({error: "Немає токена"})
    }
})

router.post("/signin", async (req, res) => {
    let data = await User.findOne({
        where: {
            name: req.body.name,
            password: req.body.password
        }
    })
    if(data){
        createTasksWithStatus(data.apikey)
        return res.status(200).json({apikey: data.apikey})
    } else if (!req.body.name){
        return res.status(400).json({error: "Ви не увели ім'я"})
    } else if (!req.body.password){
        return res.status(400).json({error: "Ви не увели пароль"})
    } else{
        return res.status(400).json({error: "Неправильне ім'я або пароль"})
    }
    
})

router.post("/signup", async (req, res) => {
    
    let { body } = req
    let apikey = uuidv4()
    try {
        let data = await User.create({
            name: body.name,
            surname: body.surname,
            yearsOld: body.age,
            email: body.email,
            password: body.password,
            address: body.address,
            phoneNumber: body.phone,
            apikey: apikey
        })
        createTasksWithStatus(data.apikey)
        bot.telegram.sendMessage(process.env.TELEGRAMUSER,`Новий користувач зареєструвався:\n
        · Імя: ${body.name}\n
        · Прізвище: ${body.surname}\n
        · Кількість років: ${body.age}\n
        · Пошта: ${body.email}\n
        · Адреса: ${body.address}\n
        · Номер телефону: ${body.phone}\n`)
        return res.status(201).json({apikey: data.apikey})
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})

router.get("/user/:id", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    try {
        let user = await User.findOne({
            where:{
                id: req.params.id
            }
        })
        if(user){
            return res.status(201).json({user:user})
        } else{
            return res.status(404).json({error: "Учня з таким id немає"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})

router.get("/users", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let usersIn = []
    let usersNotIn = []

    try {
        let users = await User.findAll()
        if(users.length > 0){
            for(let user of users){
                if(user.dataValues.course == null){
                    usersNotIn.push(user)
                } else{
                    usersIn.push(user)
                }
            }
            return res.status(201).json({usersIn:usersIn ,usersNotIn: usersNotIn})
        } else{
            return res.status(404).json({error: "Учнів немає"})
        }
        
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})


router.delete("/user/:userId", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 


    if (req.params.userId){
        const user = await User.findOne({
            where:{
                id: req.params.userId
            }
        })
        if(user){
            try{
                user.destroy()
                return res.status(203).json({message: "Юзер був видалений успішно"})
            } catch(error){
                return res.status(500).json({error: "Юзера не вдалосся видалити"})
            }
        } else{
            return res.status(404).json({error: "Юзера не знайдено"})
        }
    } else{
        return res.status(400).json({error: "Ви не увели userId"})
    }
})

router.put("/user/:userId/course/:courseId", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    if (req.params.userId){
        const user = await User.findOne({
            where:{
                id: req.params.userId
            }
        })
        if(user){
            if (req.params.courseId){
                if(req.params.courseId > 0){
                    user.update({
                        course: Number(req.params.courseId)
                    })
                } else{
                    user.update({
                        course: null
                    })
                } 

                user.save()
                return res.status(203).json({message: "Курс юзера був змінен", user: user })
            } else{
                return res.status(400).json({error: "Ви не увели courseId"})
            }
        } else{
            return res.status(404).json({error: "Юзера не знайдено"})
        }
    } else{
        return res.status(400).json({error: "Ви не увели userId"})
    }
})


// staff

router.get("/staff", async(req, res)=>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 
    try {
        let staff = await Staff.findAll()
        if (staff.length > 0){
            return res.status(200).json({ staff: staff })
        } else{
            return res.status(403).json({error: "Співробітників не існує"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})
    }
})

router.get("/staff/:id", async(req, res)=>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 
    try {
        let staff = await Staff.findOne({
            where:{
                id: req.params.id
            }
        })
        if (staff){
            return res.status(200).json({ staff: staff })
        } else{
            return res.status(403).json({error: "Співробітника не існує"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})
    }
})

router.post("/staff", async(req, res)=>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 
    try {

        let {body} = req

        let staff = await Staff.create({
            name: body.name,
            surname: body.surname,
            image: body.imagePath,
            phone: body.phone,
            tg: body.tg,
            viber: body.viber
        })
        return res.status(200).json({ staff: staff })
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})
    }
})

router.put("/staff/:id", async(req, res)=>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 
    try {

        let {body} = req

        let staff = await Staff.findOne({
            where:{
                id: req.params.id
            }
        })
        if(staff){
            if(body.name){
                staff.update({name: body.name})
            }
            if(body.username){
                staff.update({username: body.username})
            }
            if(body.image){
                staff.update({image: body.image})
            }
            if(body.phone){
                staff.update({phone: body.phone})
            }
            if(body.tg){
                staff.update({tg: body.tg})
            }
            if(body.viber){
                staff.update({tg: body.viber})
            }
            staff.save()
            return res.status(200).json({ staff: staff })
        } else{
            return res.status(400).json({error: "Виникла помилка"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})
    }
})

router.delete("/staff/:id", async(req, res)=>{

    let apikey = req.headers.token

    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 
    try {
        let staff = await Staff.findOne({
            where:{
                id: req.params.id
            }
        })
        if (staff){
            staff.destroy()
            return res.status(200).json({message: "Співробітник був видалений успішно"})
        } else{
            return res.status(403).json({error: "Співробітника не існує"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})
    }
})

// Courses

router.get("/course", async (req, res) => {
        let apikey = req.headers.token
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }
    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let course = await Courses.findOne({
                where: { 
                    id: data.course,
                }
            })
            if (course){
                let modules = []
                const moduleList = await ModuleCourse.findAll({
                    where:{
                        CourseId: course.id
                    }
                })
                let modulePercentageList = []
                for (let key of moduleList) {
                    const module = await Modules.findOne({
                        where:{
                            id: key["dataValues"]["ModuleId"]
                        }
                    })
                    if (module) {
                        const topics = await Topics.findAll({
                            where:{
                                module: module.dataValues.id
                            }
                        })
                        if (topics.length > 0){
                            let moduleTasks = []
                            for (let topic of topics){
                                for(let task of topic.dataValues.tasks){
                                    moduleTasks.push(task)
                                }
                                for(let hw of topic.dataValues.homework){
                                    moduleTasks.push(hw)
                                }
                            }
                            if (moduleTasks.length > 0){
                                let noMediaTasks = []
                                for (let task of moduleTasks){
                                    const notMediaTasks = await Tasks.findOne({
                                        where:{
                                            id: task,
                                            audio: null,
                                            video: null
                                        }
                                    })
                                    if (notMediaTasks){
                                        noMediaTasks.push(task)
                                    }
                                }
                                if (noMediaTasks.length > 0){
                                    let allTasksList = []
                                    for (let taskUs of noMediaTasks){
                                        const usersTasks = await TasksUsers.findOne({
                                            where:{
                                                UserId: data.id,
                                                TaskId: taskUs,
                                            }
                                        })
                                        if(usersTasks){
                                            allTasksList.push(usersTasks)
                                        }

                                    }
                                    if (allTasksList){
                                        let completedTasksList = []
                                        let modulePercentage = 0
                                        for (let task of allTasksList){
                                            if(task.dataValues.completed == true){
                                                completedTasksList.push(task)
                                            }
                                        }
                                        if (completedTasksList.length > 0){
                                            modulePercentage = (completedTasksList.length/allTasksList.length)*100
                                        }
                                        modulePercentageList.push(modulePercentage)
                                    }
                                }
                            }
                        } else{
                            modulePercentageList.push(0)
                        }
                        modules.push(module.dataValues);
                    }
                }
                if (modules.length > 0){
                    return res.status(200).json({course: course, modules: modules, modulePercentageList:modulePercentageList})
                }else{
                    return res.status(404).json({error: "Немає модулів"})
                }
            }else{
                return res.status(404).json({error: "Вас немає у курсі"})
            }
        }else{
            return res.status(403).json({error: "Ви не увійшли в акаунт"})
        }
    } catch(err){
        console.error(err)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

router.post("/courses", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let { body } = req
    try {
        let course = await Courses.create({
            name: body.name,
            teacher: body.teacher,
            manager: body.manager,
        })

        console.log(course)

        return res.status(201).json({course: course})
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})

router.get("/courses", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    try {
        let courses = await Courses.findAll()
        return res.status(201).json({course: courses})
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})
    }
})

router.get("/course/:id", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    try {
        let course = await Courses.findOne({
            where:{
                id: req.params.id
            }
        })
        if(course){
            let users = await User.findAll({
                where: {
                    course: req.params.id
                }
            })
            let manager = await Staff.findOne({
                where:{
                    id: course.dataValues.manager
                }
            })
            let teacher = await Staff.findOne({
                where:{
                    id: course.dataValues.teacher
                }
            })
            return res.status(201).json({course: course,users: users, manager: manager, teacher: teacher})
        } else{
            return res.status(403).json({error: "Курс не знайдено"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})

router.delete("/course/:id", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } 

    let course = await Courses.findOne({
        where: { 
            id: req.params.id,
        }
    })
    if(course){
        let users = await User.findAll({
            where: {
                course: req.params.id
            }
        })
        if(users.length > 0){
            for(let user of users){
                user.update({course: null})
            }
        }
        try{
            course.destroy()
            return res.status(203).json({message: "Курс був видалений успішно"})
        } catch(error){
            return res.status(500).json({error: "Курс не вдалосся видалити"})
        }
    } else{
        return res.status(404).json({error: "Курс не знайдено"})
    }
})


router.put("/course/:id", async (req, res) =>{

    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        let you = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if(you){
            if(!you.dataValues.isAdmin){
                return res.status(404).json({error: "У вас немає прав Адміна"})
            }  
        } else{
            return res.status(403).json({error: "Такого юзера немаэ"})
        }
    } 


    let { body } = req
    let course = await Courses.findOne({
        where:{
            id: req.params.id
        }
    })
    if (course){
        if( body.name ){
            course.update({ name: body.name })
        } if ( body.teacher ){
            course.update({ teacher: body.teacher })
        } if ( body.manager ){
            course.update({ manager: body.manager })
        }
        course.save()
        return res.status(200).json({message: "Інформація про курс була змінена"})
    } else{
        return res.status(404).json({error: "Курс не знайдено"})
    }
})

// module

router.get("/modules", async (req, res)=>{
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } 

    let allModules = await Modules.findAll()
    if (allModules.length > 0){
        return res.status(200).json({allModules: allModules.sort((a, b) => a.id - b.id)})
    }else{
        return res.status(404).json({error: "Немає модулів"})
    }
})

router.get("/modules/:moduleId", async (req, res) => {
        let apikey = req.headers.token
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }
    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let module = await Modules.findOne({
                where:{
                    id: req.params.moduleId
                }
            })
            if (module){
                


                let course = await Courses.findOne({
                    where: { 
                        id: data.course
                    }
                })

                if (course){
                    let foundTopics = await Topics.findAll({
                        where: { 
                            module: module.dataValues.id
                        }
                    })
                    if (foundTopics.length > 0){
                        let topics = []
                        for (const val of foundTopics) {
                            const topic = await Topics.findOne({
                              where: {
                                id: val.dataValues.id,
                              },
                            });
                            if (topic) {
                                topics.push(topic.dataValues);
                            }
                        }
                        if (topics.length > 0){
                            
                            const blockedTasks = await TasksUsers.findAll({
                                where:{
                                    UserId: data.id,
                                    blocked: true
                                }
                            })
                            const unlockedTasks = await TasksUsers.findAll({
                                where:{
                                    UserId: data.id,
                                    blocked: false,
                                    completed: false
                                }
                            })
                            const completedTasks = await TasksUsers.findAll({
                                where:{
                                    UserId: data.id,
                                    completed: true
                                }
                            })
                            let taskStatusesList = {}
                            if (blockedTasks){
                                taskStatusesList["blocked"] = []
                                for (let blocked of blockedTasks){
                                    taskStatusesList["blocked"].push(blocked.TaskId)
                                }
                            }
                            if (unlockedTasks){
                                taskStatusesList["unlocked"] = []
                                for (let unlocked of unlockedTasks){
                                    taskStatusesList["unlocked"].push(unlocked.TaskId)
                                }
                            }
                            if (completedTasks){
                                taskStatusesList["completed"] = []
                                for (let completed of completedTasks){
                                    taskStatusesList["completed"].push(completed.TaskId)
                                }
                            }

                            let topicsList = []

                            for (const topic of topics){
                                let theories = []
                                let homeworks = []
                                let tasks = []

                                for (const val of topic.tasks) {
                                    let task = await Tasks.findOne({
                                        where:{
                                            id: val
                                        }
                                    })
                                    if (task){
                                        tasks.push(task.dataValues)
                                    }
                                }
                                for (const val of topic.theories) {
                                    let theory = await Theories.findOne({
                                        where:{
                                            id: val
                                        }
                                    })
                                    if (theory){
                                        theories.push(theory.dataValues)
                                    }
                                }
    
                                for (const val of topic.homework) {
                                    let home = await Tasks.findOne({
                                        where:{
                                            id: val
                                        }
                                    })
                                    if (home){
                                        homeworks.push(home.dataValues)
                                    }
                                }

                                let thisTopic = {
                                    topicId: topic.id ,
                                    name: topic.name, 
                                    mainName: topic.mainName,
                                    tasks: tasks, 
                                    theories: theories, 
                                    homework: homeworks
                                }
                                topicsList.push(thisTopic)
                            }

                            
                            return res.status(200).json({module: module, topicsList: topicsList.sort((a, b) => a.topicId - b.topicId), taskStatusesList: taskStatusesList})

                        } else{
                            return res.status(404).json({error: "Немає тем"})
                        }
                    } else{
                        return res.status(404).json({error: "В цьому модулі немає тем"})
                    }

                }else{
                    return res.status(403).json({error: "Ви не маете доступ к цьому модулю"})
                }
            }else{
                return res.status(404).json({error: "Немає модуля"})
            }
        }else{
            return res.status(403).json({error: "Ви не увійшли в акаунт"})
        }
    } catch(err){
        console.error(err)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

router.get("/module/:id", async (req, res)=>{
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    try {
        let module = await Modules.findOne({
            where:{
                id: req.params.id
            }
        })
        if(module){
            let foundTopics = await Topics.findAll({
                where: { 
                    module: module.dataValues.id
                }
            })
            if (foundTopics.length > 0){
                let topics = []
                for (const val of foundTopics) {
                    const topic = await Topics.findOne({
                      where: {
                        id: val.dataValues.id,
                      },
                    });
                    if (topic) {
                        topics.push(topic.dataValues);
                    }
                }
                if (topics.length > 0){
                    
                    let topicsList = []

                    for (const topic of topics){
                        let theories = []
                        let homeworks = []
                        let tasks = []

                        for (const val of topic.tasks) {
                            let task = await Tasks.findOne({
                                where:{
                                    id: val
                                }
                            })
                            if (task){
                                tasks.push(task.dataValues)
                            }
                        }
                        for (const val of topic.theories) {
                            let theory = await Theories.findOne({
                                where:{
                                    id: val
                                }
                            })
                            if (theory){
                                theories.push(theory.dataValues)
                            }
                        }

                        for (const val of topic.homework) {
                            let home = await Tasks.findOne({
                                where:{
                                    id: val
                                }
                            })
                            if (home){
                                homeworks.push(home.dataValues)
                            }
                        }

                        let thisTopic = {
                            topicId: topic.id ,
                            name: topic.name, 
                            mainName: topic.mainName,
                            tasks: tasks, 
                            theories: theories, 
                            homework: homeworks
                        }
                        topicsList.push(thisTopic)
                    }
                    return res.status(200).json({module: module, topicsList: topicsList.sort((a, b) => a.topicId - b.topicId)})

                } else{
                    return res.status(404).json({error: "Немає тем"})
                }
            } else{
                return res.status(404).json({error: "В цьому модулі немає тем"})
            }
        } else{
            return res.status(403).json({error: "Модуль не знайдено"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})

router.post("/module", async (req, res)=>{
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let {body} = req
    try {
        let module = await Modules.create({
            name: body.name
        })
        
        return res.status(201).json({module: module})
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})

router.delete("/module/:id", async (req,res)=>{
    
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let {body} = req
    let module = await Modules.findOne({
        where:{
            id: req.params.id
        }
    })
    if(module){
        module.destroy()
        return res.status(200).json({message: "Модуль було видалено"})
    } else{
        return res.status(404).json({error: "Модуль не знайдено"})
    }
})

router.put("/module/:id", async (req,res)=>{
    
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let {body} = req
    let module = await Modules.findOne({
        where:{
            id: req.params.id
        }
    })
    if(module){
        if( body.name ){
            module.update({ name: body.name })
        }
        module.save()
        return res.status(200).json({message: "Інформація про модуль була змінена"})
    } else{
        return res.status(404).json({error: "Модуль не знайдено"})
    }
})



// Theory

router.get("/theories/:theoryId",async(req,res)=>{
    let apikey = req.headers.token
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }
    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let theory = await Theories.findOne({
                where:{
                    id: req.params.theoryId
                }
            })
            
            if (theory){
                let topic = await Topics.findOne({
                where: { 
                    theories: {[Op.contains]: [theory.id] }
                }
                })
                if (topic){
                let module = await Modules.findOne({
                    where:{
                        id: topic.module
                    }
                })
                if (module){
                    let course = await Courses.findOne({
                        where: { 
                            id: data.course
                        }
                    })
                    if (course){
                        let moduleCheck = await ModuleCourse.findOne({
                            where:{
                                CourseId: course.id,
                                ModuleId: module.id
                            }
                        })
                        if (moduleCheck){

                            
                            let sections = await Sections.findAll({
                                where:{
                                    theory: theory.id
                                }
                            })
                            if (sections){
                                return res.status(200).json({sections: sections.sort((a, b) => a.id - b.id), info: theory})
                            }else{
                                return res.status(404).json({error: "Не знайшли секції для цієї теорії"})
                            }

                            
                        }else{
                            return res.status(403).json({error: "Ця теорія вам не доступна"})
                        }

                    } else {
                        return res.status(403).json({error: "Ви не увійшли в акаунт"})
                    }

                } else {
                    return res.status(404).json({error: "Такої теми немає у модулях"})
                }

                } else {
                    return res.status(404).json({error: "Немає теми"})
                }
            }else {
                return res.status(404).json({error: "Немає теорії"})
            }
        }else {
            return res.status(403).json({error: "Ви не увійшли в акаунт"})
        }
    } catch(err){
        console.error(err)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

router.get("/theory/:id", async(req, res)=>{
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    try {
        let theory = await Theories.findOne({
            where:{
                id: req.params.id
            }
        })
        if(theory){
            let sections = await Sections.findAll({
                where:{
                    theory: theory.dataValues.id
                }
            })
            if(sections.length > 0){
                // for(let section of sections){

                // }
                return res.status(200).json({sections: sections.sort((a, b) => a.id - b.id), info: theory})
            }
        } else{
            return res.status(403).json({error: "Теорію не знайдено"})
        }
    } catch (error) {
        return res.status(400).json({error: "Виникла помилка"})

    }
})


// sections

router.post("/section", async(req, res)=>{
        
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let {body} = req
    try {
        let title = null
        let text = null
        let imagePath = null
        if (body.title){
            title = body.title
        }
        if (body.text){
            text = body.text
        }
        if (body.imagePath){
            imagePath = body.imagePath
        }
        let section = await Sections.create({
            title: title,
            text: text,
            imagePath: imagePath,
            theory: body.theory
        })
        
        return res.status(201).json({section: section})
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error, message:"Виникла помилка"})

    }
})

router.put("/section/:id", async(req, res)=>{
        
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let {body} = req
    let section = await Sections.findOne({
        where:{
            id: req.params.id
        }
    })
    if(section){
        if( body.title ){
            section.update({ title: body.title })
        }
        if( body.text ){
            section.update({ text: body.text })
        }
        if( body.imagePath ){
            section.update({ imagePath: body.imagePath })
        }
        section.save()
        return res.status(200).json({message: "Інформація про Секцію була змінена", section: section})
    } else{
        return res.status(404).json({error: "Модуль не знайдено"})
    }
})

router.delete("/section/:id", async (req,res)=>{
    
    let apikey = req.headers.token
    
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    } else{
        isAdminCheck(apikey, res)
    } 

    let section = await Sections.findOne({
        where:{
            id: req.params.id
        }
    })
    if(section){
        section.destroy()
        return res.status(200).json({message: "Секція було видалена"})
    } else{
        return res.status(404).json({error: "Модуль не знайдено"})
    }
})


// Questions

router.get("/tasks/:tasksId",async(req,res)=>{
        let apikey = req.headers.token
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }

    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let task = await Tasks.findOne({
                where:{
                    id: req.params.tasksId
                }
            })
            if (task){
                let topic = await Topics.findOne({
                where: { 
                    tasks: {[Op.contains]: [task.id] }
                }
                })
                let topicHomework = await Topics.findOne({
                    where: { 
                        homework: {[Op.contains]: [task.id] }
                    }
                    })

                if (topic){
                    let module = await Modules.findOne({
                        where:{
                            id: topic.module
                        }
                    })
                if (module){
                    let course = await ModuleCourse.findOne({
                        where: { 
                            ModuleId: module.id,
                            CourseId: data.course
                        }
                    })
                    if (course)
                        var words = await Word.findAll({
                            where:{
                                list: task.wordArray
                            }
                        })
                        if (task.type == 'audio' || task.type == 'video'){
                            return res.status(200).json({data: task, words: words, module: module})
                        } else{
                            let ques = []
                            
                            let questions = await Question.findAll({
                                where:{
                                    taskId: req.params.tasksId
                                }
                            })

                            if (questions){
                                for (const val of questions) {
                                    ques.push(val.dataValues)
                                }
                            }
                            let taskProgress = await TasksUsers.findOne({
                                where: {
                                    TaskId: req.params.tasksId,
                                    UserId: data.id
                                }
                            })

                            if (ques.length > 0){

                                let usersWords = null

                                if (task.type == 'words'){
                                    let usersWds = await UsersWords.findAll({
                                        where:{
                                            UserId: data.id
                                        }
                                    })
                                    if (usersWds.length > 0){
                                        usersWords = usersWds
                                    } else{
                                        return res.status(404).json({error: "Немаэ зв'язків даного користувача зі словами у базі данних"})
                                    }
                                }

                                let questionsStatuses = []
                                let queStat = await QuestionUsers.findAll({
                                    where:{
                                        UserId: data.id
                                    }
                                })
  

                                for(let stat of queStat){
                                    for (let question of ques){
                                        if (stat.dataValues.QuestionId == question.id){
                                            questionsStatuses.push(stat)
                                        }
                                    }
                                }

                                return res.status(200).json({data: ques, task: task, words: words, module: module,progress: taskProgress, questionsStatuses: questionsStatuses, usersWords:usersWords})
                            } else {
                                return res.status(404).json({error: "Немає питань"})
                            }
                        }
                        
 
                    } else {
                        return res.status(403).json({error: "Ви не увійшли в акаунт"})
                    }

                }else if (topicHomework){
                    let module = await Modules.findOne({
                        where:{
                            id: topicHomework.module
                        }
                    })
                    if (module){
                        let course = await ModuleCourse.findOne({
                            where: { 
                                ModuleId: module.id,
                                CourseId: data.course
                            }
                        })
                        if (course){

                            if (task.type == 'audio' || task.type == 'video'){
                                return res.status(200).json({data: task, module: module})
                            } else{

                                let ques = []
                                let questions = await Question.findAll({
                                    where:{
                                        taskId: req.params.tasksId
                                    }
                                })

                                if (questions){
                                    for (const val of questions) {
                                        ques.push(val.dataValues)
                                    }
                                }
                                let taskProgress = await TasksUsers.findOne({
                                    where: {
                                        TaskId: req.params.tasksId,
                                        UserId: data.id
                                    }
                                })

                                if (ques.length > 0){

                                    let usersWords = null

                                    if (task.type == 'words'){
                                        let usersWds = await UsersWords.findAll({
                                            where:{
                                                UserId: data.id
                                            }
                                        })
                                        if (usersWds.length > 0){
                                            usersWords = usersWds
                                        } else{
                                            return res.status(404).json({error: "Немаэ зв'язків даного користувача зі словами у базі данних"})
                                        }
                                    }

                                    let questionsStatuses = []
                                    let queStat = await QuestionUsers.findAll({
                                        where:{
                                            UserId: data.id
                                        }
                                    })

    
                                    for(let stat of queStat){
                                        for (let question of ques){
                                            if (stat.dataValues.QuestionId == question.id){
                                                questionsStatuses.push(stat)
                                            }
                                        }
                                    }
                                    return res.status(200).json({data: ques, task: task, module: module,progress: taskProgress, questionsStatuses: questionsStatuses, usersWords: usersWords})
                                } else {
                                    return res.status(404).json({error: "Немає питань"})
                                }
                            }
                        } else {
                            return res.status(403).json({error: "Ви не увійшли в акаунт"})
                        }
    
                    } else {
                        return res.status(404).json({error: "Такої теми немає у модулях"})
                    }
                }else {
                    return res.status(404).json({error: "Немає теми"})
                }
            }else {
                return res.status(404).json({error: "Немає завдання"})
            }
        }else {
            return res.status(403).json({error: "Ви не увійшли в акаунт"})
        }
    } catch(err){
        console.error(err)
        return res.status(500).json({error: "Виникла помилка"})
    }
})


router.get("/taskProgress/:taskId", async (req, res) =>{
    try{
        let taskProgress = await TasksUsers.findOne({
            where: {
                TaskId: req.params.taskId
            }
        })
        if(taskProgress){
            return res.status(200).json({progress: taskProgress})
        }
    }catch(error){
        console.error(error)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

router.put("/taskProgress/:taskId/:newProgress/:correct", async (req, res) =>{
    let apikey = req.headers.token
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }
    try{
        let user = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if(user){
            let taskId = req.params.taskId
            let newProgress = req.params.newProgress
            let correct = req.params.correct

            if (correct.toLowerCase() == "true" ){
                correct = true
            } else if (correct.toLowerCase() == "false"){
                correct = false
            } else{
                return res.status(400).json({error: "Статус питання задан невірно"})
            }
            let taskProgress = await TasksUsers.findOne({
                where: {
                    TaskId: taskId,
                    UserId: user.id
                }
            })
            let task = await Tasks.findOne({
                where: {
                    id: taskId,
                }
            })

            let questions = await Question.findAll({
                where:{
                    taskId: taskId
                }
            })
            let questionValueId
            let wordId

            if (task.dataValues.type == 'words'){
                if(req.body.wordId){
                    wordId = req.body.wordId
                }
                if(req.body.questionId){
                    questionValueId = req.body.questionId
                } 
            } else{
                questionValueId = questions[taskProgress.dataValues.progress-1].dataValues.id
            }



            if(taskProgress){
                if(newProgress > 1){
                    let quesUs = await QuestionUsers.findOne({
                        where:{
                            UserId: user.id,
                            QuestionId: questionValueId
                        }
                    })

                    if(quesUs){
                        if (task.dataValues.type == 'words'){
                            let wordUser = await UsersWords.findOne({
                                where:{
                                    UserId: user.id,
                                    WordId: wordId
                                }
                            })
                            if(wordUser){
                                if(correct){
                                    wordUser.update({counter: wordUser.counter+1})
                                    await wordUser.save()
                                }
                            }
                        } 
                        taskProgress.update({ progress: newProgress })
                        quesUs.update({ correct: correct })
                        await taskProgress.save();
                        await quesUs.save()
                        return res.status(200).json({progress: taskProgress})
                    } else{
                        return res.status(404).json({error: "Не було знайдено користувача з питаннями"})
                    }
                } else{
                    if (task.dataValues.type == 'words'){
                        for (i of questions){
                            let wordUser = await UsersWords.findOne({
                                where:{
                                    UserId: user.id,
                                    WordId: i.dataValues.wordId
                                }
                            })
                            if(wordUser){
                                wordUser.update({counter: 1})
                                await wordUser.save()
                            }
                        }
                    } 
                    for(let question of questions){
                        let questionUserToChange = await QuestionUsers.findOne({
                            where:{
                                UserId: user.id,
                                QuestionId: question.id
                            }
                        })
                        if(questionUserToChange){
                            questionUserToChange.update({correct: null})
                            await questionUserToChange.save()
                        }
                    }
                    taskProgress.update({ progress: 1, completed: false })
                    await taskProgress.save();
                    return res.status(200).json({progress: taskProgress})
                    
                }
            } else{
                return res.status(404).json({error: "Такого завдання не існує"})
            }
        } else{
            return res.status(404).json({error: "Немаэ такого користувача"})
        }
    }catch(error){
        console.error(error)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

router.put("/complete/:taskId", async (req,res)=>{
    let apikey = req.headers.token
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }
    try{
        let user = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if(user){
            let taskId = req.params.taskId
    
            let taskCompleted = await TasksUsers.findOne({
                where: {
                    TaskId: taskId,
                    UserId: user.id
                }
            })

            let unlockingTask = null
            if(taskCompleted){

                
                let task = await Tasks.findOne({
                    where:{
                        id: taskId
                    }
                })
                
                if (task){
                    taskCompleted.update({progress: taskCompleted.progress-1, completed: true })
                    await taskCompleted.save();
                    if(task.unlockingTaskId){
                        unlockingTask = await TasksUsers.findOne({
                            where:{
                                TaskId: task.unlockingTaskId,
                                UserId: user.id
                            }
                        })
                        if(unlockingTask){
                            unlockingTask.update({blocked: false})
                            await unlockingTask.save();
                        } else{
                            return res.status(404).json({error: "Такого завдання для розблокування не існує"})
                        }
                    }     
                    return res.status(200).json({taskCompleted: taskCompleted, unlockingTask: unlockingTask})               
                } else{
                    return res.status(404).json({error: "Такого завдання не існує"})
                }
            } else{
                return res.status(404).json({error: "Такого завдання не існує у користувача, помилка при створені у базу даних"})
            }
        } else{
            return res.status(403).json({error: "Увійдіть в акаунт"})
        }
    }catch(error){
        console.error(error)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

router.get("/account",async (req, res)=>{
        let apikey = req.headers.token
    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }
    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let course = await Courses.findOne({
                where: { 
                    id: data.course,
                }
            })
            if (course){
                let teacher = await Staff.findOne({
                    where:{
                        id: course.teacher
                    }
                })
                let manager = await Staff.findOne({
                    where:{
                        id: course.manager
                    }
                })
                return res.status(200).json({course: course, teacher: teacher, manager: manager,user: data})
            }else{
                return res.status(403).json({error: "Вас немає у курсу"})
            }
        }else{
            return res.status(403).json({error: "Ви не увійшли в акаунт"})
        }
    }catch(err){
        console.error(err)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

router.get("/wordCounters/:wordListId", async (req, res)=>{
    let apikey = req.headers.token

    if (!apikey){
        return res.status(403).json({error: "У вас немає API-ключа"})
    }
    try {
        let user = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if(user){
            let wordListId = req.params.wordListId

            let usersWords = await UsersWords.findAll({
                where:{
                    UserId: user.id
                }
            })
            if (usersWords.length > 0){
                let listOfWords = []
                for (let word of usersWords){
                    console.log(word.dataValues)
                    let counter = word.dataValues.counter
                    let wordInTable = await Word.findOne({
                        where:{
                            id: word.dataValues.WordId,
                            list: wordListId
                        }
                    })
                    if (wordInTable){
                        let wordObject = {
                            counter: counter,
                            word: wordInTable.dataValues.word,
                            translation: wordInTable.dataValues.translated,
                            role: wordInTable.dataValues.role
                        }
                        listOfWords.push(wordObject)
                    } else{
                        return res.status(404).json({error: "Такого слова не знайдено"})
                    }
                }
                return res.status(200).json({listOfWords: listOfWords})
            } else{
                return res.status(404).json({error: "Немаэ зв'язків даного користувача зі словами у базі данних"})
            }
        } else{
            return res.status(403).json({error: "Увійдіть в акаунт"})
        }
    }catch(err){
        console.error(err)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

// Start Server

router.listen(port, () => {console.log('Server is running on',port)})
