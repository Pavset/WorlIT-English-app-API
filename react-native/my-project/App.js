import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MaskInput from 'react-native-mask-input';
// import Video, {VideoRef} from 'react-native-video';
import NavigationPanel from "./components/navPanel"
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
       {/* <Text>{JSON.stringify(listOfModules)}</Text>
       <Text>Усі Модулі</Text>
       <Text>{JSON.stringify(allModules.sort())}</Text> */}

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
  const [topics, SetTopics] = useState('')

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
        console.log(data)
      }
    )
  }
  useEffect(()=>{getModuleInfo()},[])

  return(
    <View style={styles.profileContainer}>

      <View style={styles.header}>
        <Text style={[styles.white,styles.font32]}>{moduleInfo.name}</Text>
      </View>

      { topics &&
        <ScrollView style={styles.scroll100}>
          {topics.map((topic,idx) =>{
            return(
              <View style={styles.topicSection} key={idx}>
                <View style={styles.topicNameDiv}>
                  <Text style={[styles.orange, styles.font32]}>{topic.name} <Text style={[styles.white,styles.font32]}>{topic.mainName}</Text></Text>
                </View>
                

                <View style={styles.divForTasks}>
                  { topic.theories.map((theory, idx)=>{
                    return(
                      <TouchableOpacity style={styles.taskButton} key={idx} onPress={()=>{navigation.navigate("Theory",{id: theory.id})}}>
                        <View style={styles.taskButtonView}>
                          <Image style={styles.taskButtonImg} source={ require("./assets/book2.png") }/>
                        </View>
                        <Text>Theory</Text>
                      </TouchableOpacity>
                    )
                  })}

                  { topic.tasks.map((task, idx)=>{
                    let typeImage
                    let typeText
                    let media = false
                    if (task.type == "video"){
                      typeImage = require("./assets/video.png")
                      typeText = "video"
                      media = true
                    } else if (task.type == "test"){
                      typeImage = require("./assets/test.png")
                      typeText = "test"
                    } else if (task.type == "words"){
                      typeImage = require("./assets/words.png")
                      typeText = "words"
                    } else if (task.type == "routes"){
                      typeImage = require("./assets/routes.png")
                      typeText = "routes"
                    } else if (task.type == "sentences"){
                      typeImage = require("./assets/sentences.png")
                      typeText = "sentences"
                    } else if (task.type == "audio"){
                      typeText = "audio"
                      typeImage = {uri: "https://img.icons8.com/?size=100&id=80743&format=png&color=000000"}
                      media = true
                    }
                    if (media){
                      return(
                        <TouchableOpacity style={styles.taskButton} key={idx} onPress={()=>{navigation.navigate(`Media`)}}>
                          <View style={styles.taskButtonView}>
                            <Image style={styles.taskButtonImg} source={ typeImage }/>
                          </View>
                          <Text>{typeText}</Text>
                        </TouchableOpacity>
                      )
                    } else {
                      return(
                        <TouchableOpacity style={styles.taskButton} key={idx} onPress={()=>{navigation.navigate(`Test`)}}>
                          <View style={styles.taskButtonView}>
                            <Image style={styles.taskButtonImg} source={ typeImage }/>
                          </View>
                          <Text>{typeText}</Text>
                        </TouchableOpacity>
                      )
                    }

                  })}

                  { topic.homework.map((work, idx)=>{
                    let typeText
                    let typeImage
                    let media = false
                    if (work.type == "video"){
                      typeText = "video"
                      typeImage = require("./assets/video.png")
                      media = true
                    } else if (work.type == "test"){
                      typeText = "test"
                      typeImage = require("./assets/test.png")
                    } else if (work.type == "words"){
                      typeText = "words"
                      typeImage = require("./assets/words.png")
                    } else if (work.type == "routes"){
                      typeText = "routes"
                      typeImage = require("./assets/routes.png")
                    } else if (work.type == "sentences"){
                      typeText = "sentences"
                      typeImage = require("./assets/sentences.png")
                    } else if (task.type == "audio"){
                      typeText = "audio"
                      typeImage = {uri: "https://img.icons8.com/?size=100&id=80743&format=png&color=000000"}
                      media = true
                    }
                    if (media){
                      return(
                        <TouchableOpacity style={styles.taskButton} key={idx} onPress={()=>{navigation.navigate(`Media`)}}>
                          <View style={styles.taskButtonView}>
                            <Image style={styles.taskButtonImg} source={ typeImage }/>
                          </View>
                          <Text>{typeText}</Text>
                        </TouchableOpacity>
                      )
                    } else {
                      return(
                        <TouchableOpacity style={styles.taskButton} key={idx} onPress={()=>{navigation.navigate(`Test`)}}>
                          <View style={styles.taskButtonView}>
                            <Image style={styles.taskButtonImg} source={ typeImage }/>
                          </View>
                          <Text>{typeText}</Text>
                        </TouchableOpacity>
                      )
                    }
                  })}
                </View>

                {/* <Text>{JSON.stringify(topic)}</Text> */}

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

  useEffect(()=>{handleSubmit()},[theoryId])

  return(
    <View style={styles.profileContainer}>
    <View style={[styles.orange,{width: "100%", height: 30}]}></View>
    <ScrollView style={styles.scroll100}>
      <View>
        <Text>{theory.name}</Text>
      </View>
      { sections &&
        <View>
          { sections.map((section, idx) =>{
            return(
              <View key={idx}>
                { section.title &&
                  <Text>{section.title}</Text>
                }
                { section.text &&
                  <Text>{section.text}</Text>
                }
                { section.imagePath &&
                  <Image style={styles.lockImage} source={ section.imagePath }/>
                }
              </View>
            )
          })}
        </View>
      }
    </ScrollView>

    <NavigationPanel navigation={navigation}/>
  </View>
  )
}
  
function Media ({ navigation, route}){
  const mediaId = route.params.id
  // const videoRef = useRef<VideoRef>(null)

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

        console.log(data)
      }
    )
  }

  useEffect(()=>{handleSubmit()},[mediaId])
  // /tasks/:tasksId
  return(
    <View>
      <Text>
        jjdjdjdsfgh
      </Text>
      {/* <Video 
    // Can be a URL or a local file.
    source={{uri: "https://youtu.be/PgNhc9YiyJg"}}
    // Store reference  
    ref={videoRef}
    // Callback when remote video is buffering                                      
    onBuffer={onBuffer}
    // Callback when video cannot be loaded              
    onError={onError}               
    // style={styles.backgroundVideo}
   /> */}
      <NavigationPanel navigation={navigation}/>
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
      <Stack.Screen options={{headerShown: false}} name="Media" component={Media}/>
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
    gap: 20
  },
  taskButton:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'start',
    gap: 10,
    padding: 10,
    maxWidth: 140
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
  }
});
