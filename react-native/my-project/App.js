import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MaskInput from 'react-native-mask-input';
import NavigationPanelTest from "./components/navPanelTest"
import NavigationPanel from "./components/navPanel"
import FullWidthImage from "./components/fullWidthImage"
import { Audio } from 'expo-av';
import VideoScreen from "./components/video"
import AudioBar from './components/playTrack';
// import { background, border } from 'native-base/lib/typescript/theme/styled-system';
// import Video from 'react-native-video';
// import TrackPlayer from 'react-native-track-player';
const Stack = createNativeStackNavigator()
const port = 8000
const ip = "localhost" //192.168.80.57
const url = `http://${ip}:${port}`
LogBox.ignoreAllLogs();

function Login({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [img, changeImg] = useState("https://i.ibb.co/ByNtG9X/Frame-66.png")
  const toggleShowPassword = () => {
    if (!passwordVisible == true){
      changeImg("https://i.ibb.co/ByNtG9X/Frame-66.png")
    }else{
      changeImg("https://i.ibb.co/pQSP6Hw/Frame-67.png")
    }

    setPasswordVisible(!passwordVisible); 
  }; 
  function handleSubmit() {
    if (!username){
      setError("Ви не увели ім'я")
      return
    } else if (!password){
      setError("Ви не увели Пароль")
      return
    }
    fetch(`${url}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: username,
        password: password
      }),
    })
    .then(response => response.json())
    .then(async data => {
      if (data.error) {
        if (username.length < 0){
          setError("Ви не увели юзернейм")
        } else{
          setError(data.error)
        }
      } else {
        try {
          await AsyncStorage.setItem('apikey', `${data.apikey}`);
        } catch (error) {
          setError("Не вдалося зберегти токен у сховищі")
        } finally {
          setError("")
          navigation.navigate("Account")
        }
      }
    })

  }
  return(
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.orange,styles.font40]}>WORLD</Text>
        <Text style={[styles.white,styles.font40]}>IT</Text>
      </View>

      <View style={styles.mainRegLog}>
        <View style={styles.form}>

          <Text style={[styles.white,styles.font32]}>Login</Text>
          {/* <Text>{error}</Text> */}
          <TextInput 
            style={styles.input}
            placeholder="Имя пользователя"
            value={username}
            onChangeText={setUsername}
          />
          <View style={[styles.input,{justifyContent: "space-between"}]}>
            <TextInput
              style={styles.inputPass}
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={passwordVisible}
            />
            <TouchableOpacity onPress={()=>{toggleShowPassword()}}>
              <Image style={styles.eye} source={{uri: img}}/>
            </TouchableOpacity>
          </View>
          <Text style={[styles.orange, styles.font24]}>{error}</Text>
          <TouchableOpacity style={styles.orangeButton} onPress={()=>{handleSubmit()}}><Text style={[styles.black, styles.font24]}>Войти</Text></TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.goToRegLog} onPress={()=>{navigation.navigate("Register")}}><Text style={[styles.white, styles.font20]}>Немає акаунту?</Text></TouchableOpacity>
      
      </View>
    </View>
  )
}

function Register({navigation}) {
  // Сюда
  const [username, setUsername] = useState('');
  const [usersurename, setUsersurename] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [emailaddress, setEmailaddress] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [Countryregioncity, setCountryregioncity] = useState();
  const [error, setError] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [img, changeImg] = useState("https://i.ibb.co/ByNtG9X/Frame-66.png")

  const handleChangeAge = (text) => { 
    const numericValue = text.replace(/[^0-9]/g, ""); 
    setAge(numericValue); 
  }; 

  const toggleShowPassword = () => {
    if (!passwordVisible == true){
      changeImg("https://i.ibb.co/ByNtG9X/Frame-66.png")
    }else{
      changeImg("https://i.ibb.co/pQSP6Hw/Frame-67.png")
    }

    setPasswordVisible(!passwordVisible); 
  }; 

  function handleSubmit() {
    if (!username){
      setError("Ви не увели ім'я")
      return
    } else if (!usersurename){
      setError("Ви не увели прізвище")
      return
    } else if (!password){
      setError("Ви не увели Пароль")
      return
    } else if (password.length < 4){
      setError("Ваш пароль занадто короткий")
       return
    } else if (!age){
      setError("Ви не увели вік")
      return
    } else if (`${Number(age)}` == "NaN"){
      setError("Помилка у віці")
      return
    } else if (!emailaddress){
      setError("Ви не увели електронну пошту")
      return
    } else if (!emailaddress.includes("@")){
      setError("Немає символу @ для пошти")
      return
    } else if (!phonenumber){
      setError("Ви не увели номер телефону")
      return
    } else if (phonenumber.length < 16){
      setError("Ви увели номер не до кінця")
      return
    } else if (!Countryregioncity){
      setError("Ви не увели адресу")
      return
    } 

    
    //Сюда
    fetch(`${url}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          name: username,
          surname: usersurename,
          password: password,
          age: age,
          email: emailaddress,
          phone: phonenumber,
          address: Countryregioncity 
      }),
    })
    .then(response => response.json())
    .then(async data => {
      if (data.error) {
        setError(data.error)
      } else {
        try {
          await AsyncStorage.setItem('apikey', `${data.apikey}`);
        } catch (error) {
          setError("Не вдалося зберегти токен у сховищі")
        } finally {
          setError("")
          navigation.navigate("Account")
        }
      }
    })
  }

  //https://i.ibb.co/pQSP6Hw/Frame-67.png
  return(
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={[styles.orange,styles.font40]}>WORLD</Text>
        <Text style={[styles.white,styles.font40]}>IT</Text>
      </View>

      <View style={styles.mainRegLog}>
        <View style={styles.form}>
          <Text style={[styles.white,styles.font32]}>Реєстрація</Text>
          <TextInput 
            style={styles.input}
            placeholder="Имя пользователя"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Прізвище пользователя"
            value={usersurename}
            onChangeText={setUsersurename}
          />
          <View style={[styles.input,{justifyContent: "space-between"}]}>
            <TextInput
              style={styles.inputPass}
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={passwordVisible}
            />
            <TouchableOpacity onPress={()=>{toggleShowPassword()}}>
              <Image style={styles.eye} source={{uri: img}}/>
            </TouchableOpacity> 
          </View>

          <TextInput
            style={styles.input}
            placeholder="Вік"
            value={age}
            onChangeText={handleChangeAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Електрона адреса"
            value={emailaddress}
            onChangeText={setEmailaddress}
          />
          <MaskInput
            style={styles.input}
            placeholder="Номер телефону"
            value={phonenumber}
            onChangeText={(masked, unmasked) => {
              setPhonenumber(masked)
            }}
            mask={['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
          />
          <TextInput
            style={styles.input}
            placeholder="Країна, область, місто"
            value={Countryregioncity}
            onChangeText={setCountryregioncity}
          />
          <Text style={[styles.orange, styles.font24]}>{error}</Text>
          <TouchableOpacity style={styles.orangeButton} onPress={()=>{handleSubmit()}}><Text style={[styles.black, styles.font24]}>Реєстрація</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.goToRegLog} onPress={()=>{navigation.navigate("Login")}}><Text style={[styles.white, styles.font20]}>Є акаунт?</Text></TouchableOpacity>
      </View>
      
    </View>
  )
}

function Home({navigation}){
  const [listOfTaskId, SetListOfTaskId] = useState('')
  const [listOfTOpicsId, SetListOfTopicsId] = useState('')

  async function getListId(){
    fetch(`${url}/topics/${id}`, {
      method: 'GET',
      headers: {
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then((response)=> response.json())
    .then(
      async data => {
        SetListOfTaskId(await data)
      }
    )
  }
  async function getModule(){
    fetch(`${url}/course`, {
      method: 'GET',
      headers: {
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then((response)=> response.json())
    .then(
      async data => {
       SetListOfTopicsId(await data)
      }
    )
  }


  return(
    <View>
      <Text>2ertyhju/xt</Text>
      <Text></Text>

      <NavigationPanel navigation={navigation}/>
    </View>
  )
  
}

function Account({navigation}){
  const [userData, setUserData] = useState("")
  const [teacherData, setTeacherData] = useState("")
  const [managerData, setManagerData] = useState("")
  const [courseData, setCourseData] = useState("")

  const [errorUser, setErrorUser] = useState("")
  const [errorCourse, setErrorCourse] = useState("")


  async function getProfile(){
    fetch(`${url}/account`, {
      method: "GET",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then((response)=> response.json())
    .then(
      async data =>{
        console.log(data)
        if (data.error){
          setErrorUser(data.error)
          await navigation.navigate("Register")
        } else{
          setUserData(await data.user)
          setTeacherData(await data.teacher)
          setManagerData(await data.manager)
          setCourseData(await data.course)
        }
      }
    )
  }

  useEffect(()=>{getProfile()},[])

  clearAsyncStorage = async() => {
    AsyncStorage.clear();
    await navigation.navigate("Register")
  }

  if (userData){
    return(

      <View style={styles.profileContainer}>
        <View style={styles.profileUp}>
          <Text style={[styles.white,styles.font32]}>Профіль</Text>
        </View>
        <ScrollView style={styles.scroll100}>

          <View style={styles.profileMid}>
            <Image style={styles.avatar} source={ require("./assets/account.png") }/>
            {/* <View style={{flexDirection: 'row', width: "100%", justifyContent: "space-evenly"}}> */}
              <Text style={[styles.orange,styles.font24]}>{userData.name} {userData.surname}</Text>
              {/* <Text style={[styles.orange,styles.font24]}>{userData.surname}</Text> */}
            {/* </View> */}
            
          </View>
          <View style={styles.profileDown}>
            <View style={[styles.profileSector,styles.blackBG]}>
              <Text style={[styles.white,styles.font20]}>Курс:</Text>
              <Text style={[styles.orange,styles.font20]}>{courseData.name}</Text>
            </View>
            <Text style={[styles.white,styles.font24]}>Ментор</Text>
            <View style={styles.profileSector}>
    
              <Image style={styles.profileSectorImage} source={{uri: teacherData.image}}/>
              <View style={styles.profileSectorRight}>
    
                <Text style={[styles.orange,styles.font20]}>{teacherData.name}</Text>
                <Text style={[styles.white,styles.font16]}>{teacherData.phone}</Text>
                <View style={styles.socialsDiv}>
                    <Text onPress={() => Linking.openURL(teacherData.tg)}> 
                      <Image style={styles.socials} source={ require("./assets/telegram.png") }/> 
                    </Text>
                    <Text onPress={() => Linking.openURL(teacherData.viber)}> 
                      <Image style={styles.socials} source={ require("./assets/viber.png") } />
                    </Text>
                    
                </View>
    
              </View>
    
            </View>
    
            <Text style={[styles.white,styles.font24]}>Менеджер</Text>
            <View style={styles.profileSector}>
    
              <Image style={styles.profileSectorImage} source={{uri: managerData.image}}/>
              <View style={styles.profileSectorRight} >
    
                <Text style={[styles.orange,styles.font20]}>{managerData.name}</Text>
                <Text style={[styles.white,styles.font16]}>{managerData.phone}</Text>
                <View style={styles.socialsDiv}>
                    <Text onPress={() => Linking.openURL(managerData.tg)}> 
                      <Image style={styles.socials} source={ require("./assets/telegram.png") }/> 
                    </Text>
                    <Text onPress={() => Linking.openURL(managerData.viber)}> 
                      <Image style={styles.socials} source={ require("./assets/viber.png") } />
                    </Text>
                </View>
    
              </View>
    
            </View>

          </View>
          <View style={styles.forExitButton}>
              <TouchableOpacity style={styles.exitButton} onPress={()=>{clearAsyncStorage()}}>
                <Text style={[styles.white,styles.font20]}>Вийти</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
  
        <NavigationPanel navigation={navigation}/>
      </View>
    )
  } else{
    return(

      <View style={[styles.profileContainer,{justifyContent: "center", alignItems: "center"}]}>
        {/* <View style={styles.profileUp}>
          <Text style={[styles.white,styles.font32]}>Профіль</Text>
        </View> */}
        <ActivityIndicator size="large" color="#e19a38"/>
        {/* <ScrollView style={styles.scroll100}>

          <View style={styles.profileMid}>
            <Image style={styles.avatar} source={ require("./assets/account.png") }/>
            <Text style={[styles.orange,styles.font24]}>{userData.name}</Text>
          </View>
          <View style={styles.profileDown}>
            <View style={[styles.profileSector,styles.blackBG]}>
              <Text style={[styles.white,styles.font20]}>Курс:</Text>
              <Text style={[styles.orange,styles.font20]}>{courseData.name}</Text>
            </View>
            <Text style={[styles.white,styles.font24]}>Ментор</Text>
            <View style={styles.profileSector}>
    
              <Image style={styles.profileSectorImage} source={{uri: teacherData.image}}/>
              <View style={styles.profileSectorRight}>
    
                <Text style={[styles.orange,styles.font20]}>{teacherData.name}</Text>
                <Text style={[styles.white,styles.font16]}>{teacherData.phone}</Text>
                <View style={styles.socialsDiv}>
                    <Text onPress={() => Linking.openURL(teacherData.tg)}> 
                      <Image style={styles.socials} source={ require("./assets/telegram.png") }/> 
                    </Text>
                    <Text onPress={() => Linking.openURL(teacherData.viber)}> 
                      <Image style={styles.socials} source={ require("./assets/viber.png") } />
                    </Text>
                    
                </View>
    
              </View>
    
            </View>
    
            <Text style={[styles.white,styles.font24]}>Менеджер</Text>
            <View style={styles.profileSector}>
    
              <Image style={styles.profileSectorImage} source={{uri: managerData.image}}/>
              <View style={styles.profileSectorRight} >
    
                <Text style={[styles.orange,styles.font20]}>{managerData.name}</Text>
                <Text style={[styles.white,styles.font16]}>{managerData.phone}</Text>
                <View style={styles.socialsDiv}>
                    <Text onPress={() => Linking.openURL(managerData.tg)}> 
                      <Image style={styles.socials} source={ require("./assets/telegram.png") }/> 
                    </Text>
                    <Text onPress={() => Linking.openURL(managerData.viber)}> 
                      <Image style={styles.socials} source={ require("./assets/viber.png") } />
                    </Text>
                </View>
    
              </View>
    
            </View>

          </View>
          <View style={styles.forExitButton}>
              <TouchableOpacity style={styles.exitButton} onPress={()=>{clearAsyncStorage()}}>
                <Text style={[styles.white,styles.font20]}>Вийти</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
   */}
        <NavigationPanel navigation={navigation}/>
      </View>
    )
  }

}


function Modules({ navigation }) {
  
  const [listOfModules, SetListOfModules] = useState('')
  const [allModules, SetAllModules] = useState('')
  const [course, SetCourse] = useState('')

  async function getModule(){
    fetch(`${url}/course`, {
      method: 'GET',
      headers: {
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then((response)=> response.json())
    .then(
      async data => {
        SetListOfModules(await data.modules)
        SetCourse(await data.course)
        console.log(data)
      }
    )
  }

  async function getAllModules(){
    fetch(`${url}/modules`, {
      method: 'GET',
      headers: {
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then((response)=> response.json())
    .then(
      async data => {
        SetAllModules(await data.allModules)
        console.log(data)
      }
    )
  }

  useEffect(()=>{getAllModules()},[])
  useEffect(()=>{getModule()},[])
  return(
    <ScrollView style={styles.modulesContainer} >

      <Text style={[styles.orange,styles.font32,{width:"100%",display:"flex",justifyContent:"center"}]}>Модулі</Text>
      {!allModules && !listOfModules &&
        <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator size="large" color="#e19a38"/>
        </View>
      }
      {allModules && listOfModules &&
        <View style={styles.modulesContainer}>
          {allModules.map((module, idx) =>{
            let idList = []
            for (let h of listOfModules){
              idList.push(h.id)
            }
            let a = idList.includes(module.id)
            if (a){
              return(
                <TouchableOpacity style={styles.unlockedModuleButton} key={idx} onPress={()=>{navigation.navigate("ModulePage", {moduleId: module.id})}}>
                  <Text style={[styles.white,styles.font20,{maxWidth:"80%",wordBreak: "break-word"}]}>{module.name}</Text>
                  <View style={styles.ModuleButtonRight}>
                    <Text style={[styles.white,styles.font20]}>0.5</Text>
                    <Image style={styles.lockImage} source={ require("./assets/unlocked.png") }/>
                  </View>
                </TouchableOpacity>
            )} else{
              return(
                <View style={styles.lockedModuleButton} key={idx}>
                  <Text style={[styles.white,styles.font20,{maxWidth:"80%",wordBreak: "break-word"}]}>{module.name}</Text>
                  <View style={styles.ModuleButtonRight}>
                    <Text style={[styles.white,styles.font20]}>0</Text>
                    <Image style={styles.lockImage} source={ require("./assets/locked.png") }/>
                  </View>
                </View>
            )}
          })
          }
        </View>
      }
    </ScrollView> 
  )
}

function ModulePage({ navigation, route }){

  const [moduleInfo, SetModuleInfo] = useState('')
  const [taskStatuses, SetTaskStatuses] = useState('')
  const [topics, SetTopics] = useState('')
  const [modalOpened, SetModalOpened] = useState(false)

  const [modalRedirect, SetModalRedirect] = useState("")
  const [modalRedirectId, SetModalRedirectId] = useState("")




  const moduleId = route.params.moduleId;

  async function getModuleInfo(){
    fetch(`${url}/modules/${moduleId}`, {
      method: "GET",
      headers: {
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        SetModuleInfo(await data.module)
        SetTopics(await data.topicsList)
        SetTaskStatuses(await data.taskStatusesList)
        console.log(data)
      }
    )
  }

  function modal(redirect,task){
    SetModalRedirect(redirect)
    SetModalRedirectId(task)
    if(modalOpened){
      SetModalOpened(false)
    } else{
      SetModalOpened(true)
    }
    console.log(modalOpened)
  }
  
  async function downgradeTask(task) {
    fetch(`${url}/taskProgress/${task}/${1}`,{
      method: "PUT",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        console.log(await data)
      }
    )
    
  }


  useEffect(()=>{getModuleInfo()},[])

  return(
    <View style={styles.profileContainer}>
      {modalOpened &&
      <TouchableOpacity style={styles.modalWraper} onPress={modal}>
        <View style={styles.modal}>
          <Text style={[styles.white,styles.font32]}>It is modal Wraper</Text>
          <TouchableOpacity  onPress={()=>{
            downgradeTask(modalRedirectId)
            navigation.navigate( modalRedirect,{id: modalRedirectId} )
            }}>
              <Text style={[styles.white,styles.font32]}>Перепройти</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={modal}>
              <Text style={[styles.white,styles.font32]}>Не перепроходити</Text>
          </TouchableOpacity>
        </View>
        
      </TouchableOpacity>
      }
      <View style={styles.header}>
        <Text style={[styles.white,styles.font32]}>{moduleInfo.name}</Text>
      </View>
      {!topics &&
          <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
          <ActivityIndicator size="large" color="#e19a38"/>
          </View>
      }
      { topics &&
        <ScrollView style={styles.scroll100}>
          {topics.map((topic,idx) =>{
            let videoCounter = 0
            let testCounter = 0
            let wordsCounter = 0
            let routesCounter = 0
            let sentencesCounter = 0
            let audioCounter = 0
            return(
              <View style={styles.topicSection} key={idx}>
                <View style={styles.topicNameDiv}>
                  <Text style={[styles.orange, styles.font32]}>{topic.name} <Text style={[styles.white,styles.font32]}>{topic.mainName}</Text></Text>
                </View>
                

                <View style={styles.divForTasks}>
                  { topic.theories.map((theory, idx)=>{
                    return(
                      <TouchableOpacity style={styles.taskButton} key={idx} onPress={()=>{navigation.navigate("Theory",{id: theory.id})}}>
                        <View style={[styles.taskButtonView, styles.uncompletedTask]}>
                          <Image style={styles.taskButtonImg} source={ require("./assets/book2.png") }/>
                        </View>
                        <Text style={[styles.white, styles.font20]}>Theory</Text>
                      </TouchableOpacity>
                    )
                  })}

                  { topic.tasks.map((task, idx)=>{
                    let typeImage
                    let typeText
                    let media = false
                    let counter = 0
                    let completeStyle = styles.uncompletedTask
                    let redirect = "Test"
                    let modalOp = false

                    if (task.type == "video"){
                      typeImage = require("./assets/video.png")
                      typeText = "video"
                      media = true
                      redirect = "Media"
                      videoCounter += 1
                      counter = videoCounter
                    } else if (task.type == "test"){
                      typeImage = require("./assets/test.png")
                      typeText = "test"
                      testCounter += 1
                      counter = testCounter
                    } else if (task.type == "words"){
                      typeImage = require("./assets/words.png")
                      typeText = "words"
                      wordsCounter += 1
                      counter = wordsCounter
                    } else if (task.type == "routes"){
                      typeImage = require("./assets/routes.png")
                      typeText = "routes"
                      routesCounter += 1
                      counter = routesCounter
                    } else if (task.type == "sentences"){
                      typeImage = require("./assets/sentences.png")
                      typeText = "sentences"
                      sentencesCounter += 1
                      counter = sentencesCounter
                    } else if (task.type == "audio"){
                      typeText = "audio"
                      typeImage = {uri: "https://img.icons8.com/?size=100&id=80743&format=png&color=000000"}
                      media = true
                      redirect = "AudioPage"
                      audioCounter += 1
                      counter = audioCounter
                    }

                    // if(task.initialyBlocked){

                    // }
                    if(taskStatuses.blocked.includes(task.id)){
                      typeImage = require("./assets/lockedFile.png")
                      redirect = ""
                    } 

                    if(taskStatuses.completed.includes(task.id)){
                      completeStyle = styles.completedTask
                      modalOp = true
                    }
                    return(
                      
                        <TouchableOpacity style={[styles.taskButton,styles.antiIndexMargin]} key={idx} onPress={modalOp ? ()=>{modal(redirect,task.id)} : ()=>{navigation.navigate( redirect,{id: task.id} )}}>
                          <Text style={[styles.black, styles.font20,styles.taskIndex]}>{counter}</Text>
                          <View style={[styles.taskButtonView, completeStyle]}>
                            <Image style={styles.taskButtonImg} source={ typeImage }/>
                          </View>
                          <Text style={[styles.white, styles.font20]}>{typeText}</Text>
                        </TouchableOpacity>
                      )

                  })}
                { topic.homework &&
                <View style={[styles.topicNameDiv,styles.topicHomeWork]}>
                  <Text style={[styles.orange, styles.font32]}>Домашнє завдання</Text>  
                </View>
                }
                  { topic.homework.map((work, idx)=>{
                    if(idx <= 0){
                      videoCounter = 0
                      testCounter  = 0
                      wordsCounter  = 0
                      routesCounter  = 0
                      sentencesCounter  = 0
                      audioCounter  = 0
                    }
                    let typeImage
                    let typeText
                    let media = false
                    let counter = 0
                    let completeStyle = styles.uncompletedTask
                    let redirect = "Test"
                    
                    if (work.type == "video"){
                      typeImage = require("./assets/video.png")
                      typeText = "video"
                      media = true
                      redirect = "Media"
                      videoCounter += 1
                      counter = videoCounter
                    } else if (work.type == "test"){
                      typeImage = require("./assets/test.png")
                      typeText = "test"
                      testCounter += 1
                      counter = testCounter
                    } else if (work.type == "words"){
                      typeImage = require("./assets/words.png")
                      typeText = "words"
                      wordsCounter += 1
                      counter = wordsCounter
                    } else if (work.type == "routes"){
                      typeImage = require("./assets/routes.png")
                      typeText = "routes"
                      routesCounter += 1
                      counter = routesCounter
                    } else if (work.type == "sentences"){
                      typeImage = require("./assets/sentences.png")
                      typeText = "sentences"
                      sentencesCounter += 1
                      counter = sentencesCounter
                    } else if (work.type == "audio"){
                      typeText = "audio"
                      typeImage = {uri: "https://img.icons8.com/?size=100&id=80743&format=png&color=000000"}
                      media = true
                      redirect = "AudioPage"
                      audioCounter += 1
                      counter = audioCounter
                    }
                    
                    if(taskStatuses.blocked.includes(work.id)){
                      typeImage = require("./assets/lockedFile.png")
                      redirect = ""
                    } 
                    

                    if(taskStatuses.completed.includes(work.id)){
                      completeStyle = styles.completedTask
                    }


                    return(
                        <TouchableOpacity style={[styles.taskButton,styles.antiIndexMargin]} key={idx} onPress={()=>{navigation.navigate( redirect,{id: word.id} )}}>
                          <Text style={[styles.black, styles.font20,styles.taskIndex]}>{counter}</Text>
                          <View style={[styles.taskButtonView, completeStyle]}>
                            <Image style={styles.taskButtonImg} source={ typeImage }/>
                          </View>
                          <Text style={[styles.white, styles.font20]}>{typeText}</Text>
                        </TouchableOpacity>
                      )
                  })}
                </View>

              </View>
            )
            })
          }
          
        </ScrollView>
      }
      <NavigationPanel navigation={navigation}/>
    </View>
  )

}

function Theory({ navigation, route }) {
  const theoryId = route.params.id
  const [theory, setTheory] = useState([])
  const [sections, setSections] = useState()
  async function handleSubmit() {
    fetch(`${url}/theories/${theoryId}`,{
      method: "GET",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        setTheory(await data.info)
        setSections(await data.sections)
        console.log(data)
      }
    )
  }

  function replaceHighlighting(text){
    const regex = /~(.*?)~/g;
  
    // Используем регулярное выражение для замены ~...~ на компоненты <Text> в React Native
    const parts = [];
    let lastIndex = 0;
  
    text.replace(regex, (match, p1, offset) => {
      // Добавляем текст до текущего совпадения
      if (offset > lastIndex) {
        parts.push(text.substring(lastIndex, offset));
      }
      // Добавляем выделенный текст как компонент <Text>
      parts.push(<Text style={[styles.orange, styles.font16]}>{p1.trim()}</Text>);
      // Обновляем последний индекс
      lastIndex = offset + match.length;
    });
  
    // Добавляем оставшийся текст после последнего совпадения
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
  
    return parts;
  };

  useEffect(()=>{handleSubmit()},[theoryId])

  return(
    <View style={styles.profileContainer}>
    <View style={[styles.orangeBG,{width: "100%", height: 30}]}></View>
    <ScrollView style={[styles.scroll100,{padding: 10, marginBottom:90}]}>
      <View style={[styles.theorySection, styles.theoryTitle]}>
        <Text style={[styles.orange, styles.font40]}>{theory.name}</Text>
      </View>
      { !sections &&
        <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator size="large" color="#e19a38"/>
        </View>
      }
      { sections &&
        <View style={styles.theorySection}>
          { sections.map((section, idx) =>{
            console.log(replaceHighlighting(section.text))
            let highlightedText = replaceHighlighting(section.text);
            return(
              <View style={{gap: 15}} key={idx}>
                { section.title &&
                  <Text style={[styles.orange, styles.font24]}>{section.title}</Text>
                }
                
                <Text style={[styles.white, styles.font16,{width:"100%",wordBreak: "break-word"}]}>
                  {highlightedText.map((part, index) => (
                    typeof part === 'string' ? <Text>{part}</Text> : part
                  ))}
                </Text>
                { section.imagePath &&
                  <FullWidthImage imageUrl={section.imagePath}/>
                }
              </View>
            )
          })}
        </View>
      }
    </ScrollView>

    <NavigationPanelTest word={false} navigation={navigation}/>
  </View>
  )
}
  
function Media ({ navigation, route}){
  // console.log("media page is in production")
  // console.log(route)
  const [mediaUrl,setMediaUrl] = useState()
  const mediaId = route.params.id
  const [wordList, setWordList] = useState()

  async function handleSubmit() {
    fetch(`${url}/tasks/${mediaId}`,{
      method: "GET",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        if (!data.error){
          console.log(data)
          if (data.data.type == 'video'){
            setMediaUrl(data.data.video)
          } else if (data.data.type == 'audio'){
            setMediaUrl(data.data.audio)
          }
          setWordList(data.words)
        }
        // console.log(data.data)

      }
    )
  }

  useEffect(()=>{handleSubmit()},[mediaId])

  return(
    <View style={styles.profileContainer}>
      
      {!mediaUrl &&
                <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                <ActivityIndicator size="large" color="#e19a38"/>
                </View>
      }
      {/* {mediaUrl &&
      
      } */}
            <VideoScreen videoSource={mediaUrl}/>
      {/* </ScrollView> */}
      
      <NavigationPanelTest word={true} wordList={wordList} navigation={navigation}/>
    </View>
  )
}

function Words({navigation, route}) {
  const words = route.params.words
  return(
    <View style={styles.profileContainer}>
      {!words &&
                <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                <ActivityIndicator size="large" color="#e19a38"/>
                </View>
      }
      <Text>{JSON.stringify(words)}</Text>
      <NavigationPanelTest word={false} navigation={navigation}/>
    </View>
  )
}

function AudioPage({navigation, route}){

  // console.log('audio')
  const mediaAudioId = route.params.id
  const [AudioSRC, setAudioSRC] = useState()
  const [wordList, setWordList] = useState()
  
  async function handleSubmit() {
    fetch(`${url}/tasks/${mediaAudioId}`,{
      method: "GET",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        console.log(data.data.audio)
        setAudioSRC(await data.data.audio)
        setWordList(data.words)
      }
    )
    
  }
  useEffect(()=>{handleSubmit()},[mediaAudioId])
  

  return(
    <View style={styles.profileContainer}>
      {!AudioSRC &&
                <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                <ActivityIndicator size="large" color="#e19a38"/>
                </View>
      }
      <AudioBar url ={AudioSRC}/>
      <NavigationPanelTest word={true} wordList={wordList} navigation={navigation}/>
    </View>
  )
}

function Test ({ navigation, route}){

  const testId = route.params.id
  const [task, setTask] = useState()
  const [questions, setQuestions] = useState()
  const [wordList, setWordList] = useState()
  const [questionProgress, setQuestionProgress] = useState()
  const [module, setModule] = useState()
  const [completed, setCompleted] = useState(false)
  const [answers, setAnswers] = useState()
  let answersList = []


  function shuffleAnswers(arr) {
    // arr = wrongAnswers
    console.log(arr)
    arr.sort(() => Math.random() - 0.5);
  }


  async function getInfoOfTask() {
    fetch(`${url}/tasks/${testId}`,{
      method: "GET",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        // console.log(data)
        // console.log("kl;sadkl;sakd;lsakd;sad")
        setTask(await data.task)
        setQuestions(await data.data)
        setWordList(await data.words)
        setModule(await data.module)
        setQuestionProgress(await data.progress)
        setCompleted(await data.progress.completed)

        // let trueAns = await data.data[data.progress.progress-1].trueAnswers[0]
        // let wrongAns = await data.data[data.progress.progress-1].wrongAnswers
        // console.log(trueAns,wrongAns)
        // setAnswers(await shuffleAnswers(trueAns, wrongAns))
        // console.log(await shuffleAnswers(trueAns, wrongAns))

        if(data.progress.progress > data.data.length){
          console.log("kl;sadkl;sakd;lsakd;sad")
          completeTask()
          // if (completed || await data.progress.completed){
          console.log(`Navigation to module ${data.module.name}`)
          navigation.navigate( "ModulePage",{moduleId: await data.module.id} )
          // }
        }
      }
    )
    
  }

  async function updateProgresId(newProg) {
    fetch(`${url}/taskProgress/${testId}/${newProg}`,{
      method: "PUT",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        console.log(await data)
        setQuestionProgress(await data.progress.progress)
        getInfoOfTask()
        
        if(await questionProgress.progress > await questions.length){
          navigation.navigate( "ModulePage",{moduleId: module.id} )
        }
      }
    )
    
  }

  async function completeTask(){
    fetch(`${url}/complete/${testId}`,{
      method: "PUT",
      headers:{
        "token": await AsyncStorage.getItem('apikey')
      }
    })
    .then(response => response.json())
    .then(
      async data => {
        console.log(await data)
        setCompleted(true)
      }
    )
  }

  
  



  useEffect(()=>{getInfoOfTask()},[testId])
  return(
    <View style={styles.profileContainer}>
      {!questions && !questionProgress &&
      
        <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
          <ActivityIndicator size="large" color="#e19a38"/>
        </View>
      }

      {questions && questionProgress && questions[questionProgress.progress-1] &&
      <View>
        <Text>{questions[questionProgress.progress-1].question}</Text>
        {/* <Text>{JSON.stringify(questions[questionProgress.progress-1])}</Text> */}
        { questions[questionProgress.progress-1].wrongAnswers.map((answer, idx) =>{
          answersList.push(answer)
          if (!answersList.includes(questions[questionProgress.progress-1].trueAnswers[0])){
            answersList.push(questions[questionProgress.progress-1].trueAnswers[0])
          }
          shuffleAnswers(answersList)
        }
        )}
        {
          answersList.map((ans, idx) =>{
            return(
            <TouchableOpacity key={idx} style={styles.orangeButton} onPress={()=>{updateProgresId(questionProgress.progress+1)}}>
              <Text style={[styles.black, styles.font24]}>{ans}</Text>
            </TouchableOpacity>
            )
          })
        }
      </View>
      }

      
      <NavigationPanelTest word={true} wordList={wordList} navigation={navigation}/>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName='Account'>
      <Stack.Screen options={{headerShown: false}} name="Login" component={Login}/>
      <Stack.Screen options={{headerShown: false}} name="Register" component={Register}/>
      <Stack.Screen options={{headerShown: false}} name="Account" component={Account}/>
      <Stack.Screen options={{headerShown: false}} name="Home" component={Home}/>
      <Stack.Screen options={{headerShown: false}} name="Modules" component={Modules}/>
      <Stack.Screen options={{headerShown: false}} name="ModulePage" component={ModulePage}/>
      <Stack.Screen options={{headerShown: false}} name="Theory" component={Theory}/>
      <Stack.Screen options={{headerShown: false}} name="AudioPage" component={AudioPage}/>
      <Stack.Screen options={{headerShown: false}} name="Test" component={Test}/>
      <Stack.Screen options={{headerShown: false}} name="Media" component={Media}/>
      <Stack.Screen options={{headerShown: false}} name="Words" component={Words}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({

  blackBG:{
    backgroundColor:"#252124"
  },
  blackLightBG:{
    backgroundColor:"#4F4F4F"
  },
  orangeBG:{
    backgroundColor:"#E19A38"
  },
  white:{
    color:"#fff",
  },
  black:{
    color:"#252124",
  },
  orange:{
    color: "#E19A38"
  },
  red:{
    color: "#E15638"
  },
  font40:{
    fontSize:40
  },
  font32:{
    fontSize:32
  },
  font24:{
    fontSize:24
  },
  font20:{
    fontSize:20
  },
  font16:{
    fontSize:16
  },
  orangeButton:{
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor:"#E19A38",
    borderRadius: 10
  },
  scroll100:{
    padding: 0,
    margin:0,
    width: "100%",
    paddingBottom: "20%",
  },

  // reg/log 
  container: {
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    margin:0,
    width: "100%",
    height: "100%",
    paddingBottom: 40
  },
  header:{
    display: "flex",
    flexDirection:"row",
    backgroundColor: '#252124',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingTop: 40,
    // height:"10%",
    // maxHeight:100,
    width:"100%"
  },
  mainRegLog:{
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#252124',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin:0,
    width: "90%",
    height: "85%",
    borderRadius:10
  },
  form:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap:15,
    margin:0,
    width: "100%",
    height:"90%",
  },
  input:{
    display: "flex",
    flexDirection:"row",
    backgroundColor: '#4F4F4F',
    alignItems: 'center',
    justifyContent: 'start',
    padding: 10,
    width:"100%",
    color:"#fff",
    borderRadius:5,
    fontSize: 20,
    // height: 100
    // outlineColor: "#3B3B3B",
    // outlineStyle: "solid",
    // outlineWidth: 4,
  },
  inputPass:{
    display: "flex",
    flexDirection:"row",
    // backgroundColor: '#4F4F4F',
    alignItems: 'center',
    justifyContent: 'start',
    // padding: 10,
    width:"100%",
    color:"#fff",
    borderRadius:5,
    fontSize: 20,
    // outlineColor: "#3B3B3B",
    // outlineStyle: "solid",
    // outlineWidth: 4,
  },
  eye:{
    width: 35,
    height: 35
  },
  goToRegLog:{
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  },


  // account

  profileContainer:{
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'start',
    // padding: "0 0 10px 0",

    width:"100%",
    height: "100%",
    padding: 0,
    margin:0,
  },
  profileUp:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    gap: 10,
    padding: 10,
    backgroundColor:"#252124",
    paddingTop: 40

  },
  profileMid:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    gap: 10,
    padding: 10,
    boxSizing: "border-box",
  },
  avatar:{
    width: 120,
    height: 120
  },
  username:{
    width: "100%",
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    textAlign: 'center',
    color: "#E19A38"
  },
  profileDown:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'start',
    justifyContent: 'start',
    width: "100%",
    gap: 10,
    padding: 10,
    boxSizing: "border-box",
    backgroundColor:"#4F4F4F"
  },
  profileSector:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'start',
    justifyContent: 'start',
    width: "100%",
    gap: "5%",
    padding: "2%",
    boxSizing: "border-box",
    borderRadius: "10px"
  },
  profileSectorImage:{
    width: 100,
    height: 100,
    borderRadius: 10,
    border: "3px #252124 solid"
  },
  profileSectorRight:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'start',
    justifyContent: 'start',
    width: "70%",
    // height:"100%",
    gap: 10,
    padding: 10,
    // paddingHorizontal: 10,
    borderRadius: 10,
    boxSizing: "border-box",
    backgroundColor: "#252124"
  },
  socialsDiv:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'start',
    width: "100%",
    gap: 10,
    padding: 0,
    boxSizing: "border-box",
  },
  forExitButton:{
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%",
    paddingVertical: 20
  },
  exitButton:{
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    border: "4px solid #fff",
    borderRadius: 10,
    width:"100px"
  },

  // modules

  modulesContainer:{
    // display: "flex",
    // flexDirection:"column",
    backgroundColor: '#252124',
    // alignItems: 'center',
    // justifyContent: 'start',
    paddingHorizontal: 15,
    paddingVertical: 40,
    margin:0,
    gap: 15,
    width: "100%",
    height: "100%",
    width: "100%"
  },
  unlockedModuleButton:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: "2px #E19A38 solid",
    borderRadius: 5,
    backgroundColor:"#3B3B3B",
    width: "100%"
  },
  lockedModuleButton:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: "2px #9DACAC solid",
    borderRadius: 5,
    backgroundColor:"#3B3B3B",
    width: "100%"
  },
  ModuleButtonRight:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  lockImage:{
    width: 22,
    height: 22
  },

  // module

  topicNameDiv:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:"center",
    borderBottomWidth: 3,
    borderBottomColor:"#fff",
    width:"100%"
  },
  topicHomeWork:{
    border: "none"
  },
  topicSection:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'start',
    width:"100%",
    gap: 10
  },
  divForTasks:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'start',
    justifyContent: 'space-between',
    flexWrap:"wrap",
    width:"80%",
    // gap: 20
  },
  antiIndexMargin:{
    marginTop: -50
  },
  taskButton:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'start',
    gap: 10,
    padding: 10,
    maxWidth: 140,
  },
  taskButtonImg:{
    width: 74,
    height: 74,
  },
  taskButtonView:{
    padding: 25,
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    border: "4px #E19A38 solid",

    borderRadius: 20
  },
  taskIndex:{
    position:"relative",
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    border: "4px #252124 solid",
    borderRadius: 360,
    backgroundColor:"#E19A38",
    top: 46,
    right: -50,
    zIndex: 2
  },
  uncompletedTask:{
    backgroundColor:"#D1D8DB",
    border:"4px #E19A38 solid"
  },
  completedTask:{
    backgroundColor:"#E19A38",
    border:"4px #252124 solid"
  },
  
  modalWraper:{
    position:"absolute",
    top:0,
    left:0,
    width:"100vw",
    height:"100vh",
    display:"flex",
    direction:"column",
    alignItems:"center", 
    justifyContent:"center",
    backgroundColor:"#25212457",
    zIndex:3
  },
  modal:{
    display:"flex",
    direction:"column",
    alignItems:"center", 
    justifyContent:"center",
    width:"90%",
    backgroundColor:"#3B3B3B",
    borderRadius:10,
    border:"3px #252124 solid"
  },

  // theory
  theorySection:{
    width: "100%", 
    display:"flex", 
    direction:"column",
    alignItems:"start", 
    justifyContent:"start",
    paddingVertical:10,
    gap: 15
  },
  theoryTitle:{
    borderBottomColor:"#fff",
    borderBottomWidth: 2
  },
});
