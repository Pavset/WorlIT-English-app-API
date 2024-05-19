// Import Modules

const express = require('express')
const cors = require('cors');
const { User,Courses,Modules,Topics,Theories,Tasks,Question } = require("./db.js")
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
                    let topics = []
                    for (const val of modules) {
                        let topic = await Topics.findOne({
                            where:{
                                id: val.id
                            }
                        })
                        if (topic){
                            topics.push(topic)
                        }
                    }
                    if (topics.length > 0){
                        return res.status(200).json({course: course, modules: modules, topics: topics})
                    } else {
                        return res.status(404).json({error: "Немає тем"})
                    }
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
                            return res.status(200).json({data: tasks})
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

// Start Server

router.listen('8000', () => {console.log('Server is running')})