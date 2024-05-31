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
        type: DataTypes.TEXT,
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
    },

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
    },
    teacher:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    manager:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
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
    homework:{
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

const Sections = sequelize.define("Sections",{
    text:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    imagePath:{
        type: DataTypes.TEXT,
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
    sectionsList:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
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
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
    video:{
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
    wordArray:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        unique: false
    }
})

const WordList = sequelize.define("WordList",{
    array:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        unique: false
    }
})

const Word = sequelize.define("Word",{
    word:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    translated:{
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
})

const Question = sequelize.define("Question",{
    question:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    imagePath:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    trueAnswers:{
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        unique: false
    },
    wrongAnswers:{
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        unique: false
    },
    extraQuestionText:{
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    }
})

const Staff = sequelize.define("Staff",{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    surname:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    image:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    tg:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    viber:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
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
    Question: Question,
    Sections: Sections,
    Staff: Staff,
    Word: Word,
    WordList: WordList
}