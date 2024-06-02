import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"

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
        setError(data.error);
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
  const [Countryregioncity, setCountryregioncity] = useState('');
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
        setError(data.error);
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
            onChangeText={setAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Електрона адреса"
            value={emailaddress}
            onChangeText={setEmailaddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Номер телефону"
            value={phonenumber}
            onChangeText={setPhonenumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Країна, область, місто"
            value={Countryregioncity}
            onChangeText={setCountryregioncity}
          />
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
    fetch(`${url}/cource`, {
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
    
              <Image style={styles.profileSectorImage} source={ require("./assets/wit_picture.png") }/>
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
    
              <Image style={styles.profileSectorImage} source={ require("./assets/wit_picture.png") }/>
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

{/* Лёша */}
function Modules() {
  return(
    <View style={styles.container}>
       <Text>Модулі</Text>
       {/* Сюда Text, View */}
       <View>
       <View>
          <Text>Present Simple</Text>
       </View>
       <View>
          <Text>Present Simple</Text>
       </View>
       <View>
          <Text>Present Simple</Text>
       </View>
       <View>
          <Text>Present Simple</Text>
       </View>
       <View>
          <Text>Present Simple</Text>
       </View>
       
              </View>

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
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
    height:"10%",
    maxHeight:100,
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
  scroll100:{
    padding: 0,
    margin:0,
    width: "100%",
    paddingBottom: "20%",
  },
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

  },
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
  orangeButton:{
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor:"#E19A38",
    borderRadius: 10
  },

});
