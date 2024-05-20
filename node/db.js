const {DataTypes, Sequelize} = require('sequelize')

const sequelize = new Sequelize('postgres://first_team_wit:uEqhk6IjdlE8LuHmmSZRGlU5AiFQF4MC@dpg-cp3ml87sc6pc73fs1dpg-a.frankfurt-postgres.render.com/worldit?ssl=true', {
    dialect: "postgres",
})

const User = sequelize.define("User",{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    yearsOld:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    apikey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    completedTasks:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        unique: false
    }
})

const Courses = sequelize.define("Courses",{
    name:{ 
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    users:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        unique: false
    },
    modules:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        unique: false
    }
})

const Modules = sequelize.define("Modules",{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    topics:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        unique: false
    }
})

const Topics = sequelize.define("Topics",{
    mainName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    tasks:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        unique: false
    },
    theories:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        unique: false
    }
})

const Theories = sequelize.define("Theories",{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    text:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        unique: false
    },
    title:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        unique: false
    },
    imagePaths:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        unique: false
    }
})

const Tasks = sequelize.define("Tasks",{
    questions:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        unique: false
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    audio:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    video:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    }
})

const Question = sequelize.define("Question",{
    translated:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    imagePath:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    text:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    rightAnswer:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    wrongAnswers:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        unique: false
    }
})

sequelize.authenticate()
sequelize.sync()

module.exports = {
    User: User,
    Courses: Courses,
    Modules: Modules,
    Topics: Topics,
    Theories: Theories,
    Tasks: Tasks,
    Question: Question
}