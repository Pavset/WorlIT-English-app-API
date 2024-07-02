const {DataTypes, Sequelize} = require('sequelize')
require('dotenv').config();
const url = process.env.DB_URL

const sequelize = new Sequelize(url, {
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
    course:{
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false
    },
    isAdmin:{
        type: DataTypes.BOOLEAN,
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
    }
})

const ModuleCourse = sequelize.define("ModuleCourse")

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
    }, 
    module:{
        type: DataTypes.INTEGER,
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
        allowNull: true,
        unique: false
    },
    imagePath:{
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
    theory:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    }
})

const Theories = sequelize.define("Theories",{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
})

const Tasks = sequelize.define("Tasks",{type:{
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
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false
    },
    initialyBlocked:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false
    },
    unlockingTaskId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    }
})

const TasksUsers = sequelize.define("TasksUsers",{
    blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false
    },
    completed:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false
    },
    progress:{
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false
    }
})

const QuestionUsers = sequelize.define("QuestionUsers",{
    correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        unique: false
    }
})

const UsersWords = sequelize.define("UsersWords",{
    counter:{
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false
    }
})

const WordList = sequelize.define("WordList",{
    name:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    } 
})

const Word = sequelize.define("Word",{
    word:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    translated:{
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
    list:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
})

const Question = sequelize.define("Question",{
    question:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    questionType:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    imagePath:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    trueAnswers:{
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
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
    },
    taskId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    wordId:{
        type: DataTypes.INTEGER,
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

User.belongsTo(Courses,{
    foreignKey: "course"
})

Courses.belongsTo(Staff,{
    foreignKey: "teacher"
})

Courses.belongsTo(Staff,{
    foreignKey: "manager"
})

Word.belongsTo(WordList,{
    foreignKey: "list"
})

Question.belongsTo(Tasks,{
    foreignKey: "taskId"
})

Theories.hasMany(Sections,{
    foreignKey: "theory"
})
Sections.belongsTo(Theories,{
    foreignKey: "theory"
})

Modules.hasMany(Topics,{
    foreignKey: "module"
})
Topics.belongsTo(Modules,{
    foreignKey: "module"
})



Modules.belongsToMany(Courses, { through: ModuleCourse })
Courses.belongsToMany(Modules, { through: ModuleCourse })

User.belongsToMany(Tasks, {through: TasksUsers})
Tasks.belongsToMany(User, {through: TasksUsers})

User.belongsToMany(Question,{through:QuestionUsers})
Question.belongsToMany(User,{through:QuestionUsers})

User.belongsToMany(Word,{through:UsersWords})
Word.belongsToMany(User,{through:UsersWords})


sequelize.authenticate()
// sequelize.sync()


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
    WordList: WordList,
    ModuleCourse: ModuleCourse,
    TasksUsers: TasksUsers,
    UsersWords: UsersWords,
    QuestionUsers: QuestionUsers
}