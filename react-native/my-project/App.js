import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import NavigationPanel from "./components/navPanel"
const Stack = createNativeStackNavigator()
const port = 8000
const ip = "192.168.80.57"
const url = `http://${ip}:${port}`
LogBox.ignoreAllLogs();

function Login({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("")
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
          navigation.navigate("Home")
        }
      }
    })

  }
  return(
    <View style={styles.container}>
      <Text>Login</Text>
      {/* <Text>{error}</Text> */}
      <TextInput 
        style={styles.input}
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput 
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={()=>{handleSubmit()}}><Text>Войти</Text>
        </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate("Register")}}><Text>Немає акаунту?</Text></TouchableOpacity>
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
          navigation.navigate("Home")
        }
      }
    })
  }


  return(
    <View style={styles.container}>
      <Text>Register</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
      />
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
      <TouchableOpacity onPress={()=>{handleSubmit()}}><Text>Реєстрація</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate("Login")}}>Є аккаунт?</TouchableOpacity>
      <NavigationPanel navigation={navigation}/>
    </View>
  )
}

function Home(){
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
        SetListOfTaskId(await data)
      }
    )
  }


  return(
    <View>
      <Text>2ertyhju/xt</Text>
    
      <NavigationPanel navigation={navigation}/>
    </View>
  )
  
}

function Account(){
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
            <Text style={[styles.black,styles.font24]}>Ментор</Text>
            <View style={styles.profileSector}>
    
              <Image style={styles.profileSectorImage} source={ require("./assets/wit_picture.png") }/>
              <View style={styles.profileSectorRight}>
    
                <Text style={[styles.black,styles.font20]}>{teacherData.name}</Text>
                <Text style={[styles.orange,styles.font16]}>{teacherData.phone}</Text>
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
    
            <Text style={[styles.black,styles.font24]}>Менеджер</Text>
            <View style={styles.profileSector}>
    
              <Image style={styles.profileSectorImage} source={ require("./assets/wit_picture.png") }/>
              <View style={styles.profileSectorRight} >
    
                <Text style={[styles.black,styles.font20]}>{managerData.name}</Text>
                <Text style={[styles.orange,styles.font16]}>{managerData.phone}</Text>
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
          <TouchableOpacity onPress={()=>{clearAsyncStorage()}}>
            <Text>Вийти</Text>
          </TouchableOpacity>
        </ScrollView>
  
  
        <NavigationPanel navigation={navigation}/>
      </View>
    )
} 
// else{
//   navigation.navigate("Register")
// }
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
     <Stack.Navigator initialRouteName='Register'>
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
  scroll100:{
    padding: 0,
    margin:0,
    width: "100%",
    paddingBottom: "20%"

  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',
    padding: 0,
    margin:0,
    width: "100%"
  },
  profileContainer:{
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'start',
    // padding: "0 0 10px 0",
    // gap: 20,

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
  white:{
    color:"#fff",
  },
  black:{
    color:"#252124",
  },
  orange:{
    color: "#E19A38"
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
    width: 106,
    height: 106
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
  },
  profileSector:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'start',
    width: "100%",
    backgroundColor:"#fff",
    gap: "5%",
    padding: "2%",
    boxSizing: "border-box",
    borderRadius: "10px"
  },
  profileSectorImage:{
    width: 75,
    height: 75,
    borderRadius: 10
  },
  profileSectorRight:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'start',
    justifyContent: 'start',
    // width: "90%",
    // height:"100%",
    gap: 10,
    padding: 10,
    // paddingHorizontal: 10,
    boxSizing: "border-box",
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
  }
});
