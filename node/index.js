// Import Modules

const express = require('express')
const cors = require('cors');
const { User,Courses,Modules,Topics,Theories,Tasks,Question,Staff,Word,WordList,Sections } = require("./db.js")
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");

// Router

const router = express()
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());
router.use(express.static('public'))

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
                users: {[Op.contains]: [data.id] }
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
        return res.status(200).json({apikey: data.apikey})
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
        return res.status(201).json({apikey: data.apikey})
    } catch (error) {
        console.error(error)
        return res.status(400).json({error: "Виникла помилка"})
    }
})

// Courses

router.get("/course", async (req, res) => {
    let apikey = req.headers.token
    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let course = await Courses.findOne({
                where: { 
                    users: {[Op.contains]: [data.id] }
                }
            })
            if (course){
                let modules = []
                for (const val of course.modules) {
                    const module = await Modules.findOne({
                      where: {
                        id: val,
                      },
                    });
                    if (module) {
                      modules.push(module.dataValues);
                    }
                }
                
                if (modules.length > 0){
                    return res.status(200).json({course: course, modules: modules})
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

router.get("/modules/:moduleId", async (req, res) => {
    let apikey = req.headers.token
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
                        users: {[Op.contains]: [data.id] },
                        modules: {[Op.contains]: [req.params.moduleId]}
                    }
                })

                if (course){
                    let topics = []
                    for (const val of module.topics) {
                        const topic = await Topics.findOne({
                          where: {
                            id: val,
                          },
                        });
                        if (topic) {
                            topics.push(topic.dataValues);
                        }
                    }
                    if (topics.length > 0){
                        return res.status(200).json({module: module, topics: topics})
                    }else{
                        return res.status(404).json({error: "Немає тем"})
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

router.get("/topics/:id",async(req,res)=>{
    let apikey = req.headers.token
    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let topic = await Topics.findOne({
                where:{
                    id: req.params.id
                }
            })
            if (topic){
                let module = await Modules.findOne({
                    where:{
                        topics: {[Op.contains] : [topic.id]}
                    }
                })
                if (module){
                    let course = await Courses.findOne({
                        where: { 
                            modules: {[Op.contains]: [module.id] }
                        }
                    })
                    if (course){
                        let tasks = []
                        for (const val of topic.tasks) {
                            let task = await Tasks.findOne({
                                where:{
                                    id: val
                                }
                            })
                            if (task){
                                tasks.push(task)
                            }
                        }
                        if (tasks.length > 0){
                            let theories = []
                            let homeworks = []

                            for (const val of topic.theories) {
                                let theory = await Theories.findOne({
                                    where:{
                                        id: val
                                    }
                                })
                                if (theory){
                                    theories.push(theory)
                                }
                            }

                            for (const val of topic.homework) {
                                let theory = await Tasks.findOne({
                                    where:{
                                        id: val
                                    }
                                })
                                if (theory){
                                    homeworks.push(theory)
                                }
                            }
                            return res.status(200).json({topic: topic, tasks: tasks, theories: theories, homework: homeworks})
                        } else {
                            return res.status(404).json({error: "Немає завдань"})
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
            return res.status(403).json({error: "Ви не увійшли в акаунт"})
        }
    } catch(err){
        console.error(err)
        return res.status(500).json({error: "Виникла помилка"})
    }
})

// Theory

router.get("/theories/:theoryId",async(req,res)=>{
    let apikey = req.headers.token
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
                        topics: {[Op.contains] : [topic.id]}
                    }
                })
                if (module){
                    let course = await Courses.findOne({
                        where: { 
                            modules: {[Op.contains]: [module.id] }
                        }
                    })
                    if (course){
                        // let tasks = []
                        // for (const val of topic.tasks) {
                        //     let task = await Tasks.findOne({
                        //         where:{
                        //             id: val
                        //         }
                        //     })
                        //     if (task){
                        //         tasks.push(task)
                        //     }
                        // }
                        // if (tasks.length > 0){
                            let theories = []

                            for (const val of theory.sectionsList) {
                                let theory = await Sections.findOne({
                                    where:{
                                        id: val
                                    }
                                })
                                if (theory){
                                    theories.push(theory)
                                }
                            }
                            return res.status(200).json({data: theory, theories: theories})
                        // } else {
                        //     return res.status(404).json({error: "Немає завдань"})
                        // }
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

// Questions

router.get("/tasks/:tasksId",async(req,res)=>{
    let apikey = req.headers.token
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
                        topics: {[Op.contains] : [topic.id]}
                    }
                })
                if (module){
                    let course = await Courses.findOne({
                        where: { 
                            modules: {[Op.contains]: [module.id] }
                        }
                    })
                    if (course)

                        if (task.type != 'question'){
                            return res.status(200).json({data: task})
                        }else{
                            let ques = []
                            let words = []
                            let wordList = []
                            for (const val of task.questions) {
                                let question = await Question.findOne({
                                    where:{
                                        id: val
                                    }
                                })
                                if (question){
                                    ques.push(question)
                                }
                            }
                            for (const val of task.wordArray) {
                                let question = await WordList.findOne({
                                    where:{
                                        id: val
                                    }
                                })
                                if (question){
                                    wordList.push(question.dataValues)
                                }
                            }
                            if (wordList.length > 0){
                                for (const list of wordList) {
                                    for (const val of list.array){
                                        let question = await Word.findOne({
                                            where:{
                                                id: val
                                            }
                                        })
                                        if (question){
                                            words.push(question.dataValues)
                                        }
                                    }

                                }
                            }
                            if (ques.length > 0){
                                return res.status(200).json({data: ques, task: task, words: words})
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
                            topics: {[Op.contains] : [topicHomework.id]}
                        }
                    })
                    if (module){
                        let course = await Courses.findOne({
                            where: { 
                                modules: {[Op.contains]: [module.id] }
                            }
                        })
                        if (course){

                            if (task.type != 'question'){
                                return res.status(200).json({data: task})
                            }else{
                                let ques = []
                                for (const val of task.questions) {
                                    let question = await Question.findOne({
                                        where:{
                                            id: val
                                        }
                                    })
                                    if (question){
                                        ques.push(question)
                                    }
                                }
                                if (ques.length > 0){
                                    return res.status(200).json({data: ques, task: task})
                                } else {
                                    return res.status(404).json({error: "Немає питань"})
                                }
                            }
                            // let ques = []
                            // for (const val of task.questions) {
                            //     let question = await Question.findOne({
                            //         where:{
                            //             id: val
                            //         }
                            //     })
                            //     if (question){
                            //         ques.push(question)
                            //     }
                            // }
                            // if (ques.length > 0){
                            //     return res.status(200).json({data: ques})
                            // } else {
                            //     return res.status(404).json({error: "Немає завдань"})
                            // }
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

router.get('/complete/:taskId/:id', async (req, res)=>{
    try {
        let apikey = await User.findOne({
            where:{
                apikey: req.headers.token
            }
        })
        if (apikey){
            let task = await Tasks.findOne({
                where:{
                    id: req.params.taskId,
                    type: "question"
                }
            })
            if (task){
                let question = await Question.findOne({
                    where:{
                        id: req.params.id
                    }
                })
                if (question){
                    if (task.questions[task.questions.length - 1] == question.id){
                        if (apikey.completedTasks){
                            let isUserHas = await User.findOne({
                                where:{
                                    apikey: req.headers.token,
                                    completedTasks: {[Op.contains] : [task.id]}
                                }
                            })
                            let list = apikey.completedTasks
                            if (!isUserHas){
                                list.push(task.id)
                                let user = await User.update(
                                    {
                                        completedTasks: list
                                    },
                                    {
                                        where:{
                                            apikey: req.headers.token
                                        }
                                    }
                                )
                            }
                        }else{
                            let user = await User.update(
                                {
                                    completedTasks: [task.id]
                                },
                                {
                                    where:{
                                        apikey: req.headers.token
                                    }
                                }
                            )
                        }
                        return res.status(200).json({data: "Ви пройшли завдання!"})
                    }else{
                        return res.status(200).json({data: "Продовжте проходити."})
                    }
                }else{
                    return res.status(404).json({error: "Немає питання"})
                }
            }else{
                return res.status(404).json({error: "Немає завдання"})
            }
        }else{
            return res.status(403).json({error: "Ви не увійшли в акаунт"})
        }
    }catch(err){
        console.error(err)
    }
})

router.get("/account",async (req, res)=>{
    let apikey = req.headers.token
    try {
        let data = await User.findOne({
            where:{
                apikey: apikey
            }
        })
        if (data){
            let course = await Courses.findOne({
                where: { 
                    users: {[Op.contains]: [data.id] }
                }
            })
            // console.log(data.dataValues)
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

// Start Server

router.listen('8000', () => {console.log('Server is running')})