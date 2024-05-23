import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import NavigationPanel from "./components/navPanel"
const Stack = createNativeStackNavigator()
const port = 8000
const url = `http://192.168.0.105:${port}`
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
          navigation.navigate("Main")
        }
      }
    })

  }
  return(
    <View style={styles.container}>
      <Text>Login</Text>
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
          navigation.navigate("Main")
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
    </View>
  )
}

function Account(){
  let username = "Тестер 45678"
  let mentorName = "МАНТАР"
  let mentorNumber = "00000000"
  let mentorTgUrl = "https://t.me/+kj3lQ5kV14s3NTMy"
  let mentorVibUrl = "https://t.me/+kj3lQ5kV14s3NTMy"
  let menejerName = "МЕНАЖЕР"
  let menejerNumber = "00000"
  let menejerTgUrl = "https://t.me/+kj3lQ5kV14s3NTMy"
  let menejerVibUrl = "https://t.me/+kj3lQ5kV14s3NTMy"
  return(
    <View style={styles.profileContainer}>

      <View style={styles.profileUp}>
        <Text style={[styles.white,styles.font32]}>Профіль</Text>
      </View>


      <View style={styles.profileMid}>
        <Image style={styles.avatar} source={ require("./assets/account.png") }/>
        <Text style={[styles.orange,styles.font24]}>{username}</Text>
      </View>


      <View style={styles.profileDown}>

        <Text style={[styles.black,styles.font24]}>Ментор</Text>
        <View style={styles.profileSector}>

          <Image style={styles.profileSectorImage} source={ require("./assets/wit_picture.png") }/>
          <View style={styles.profileSectorRight}>

            <Text style={[styles.black,styles.font20]}>{mentorName}</Text>
            <Text style={[styles.orange,styles.font16]}>{mentorNumber}</Text>
            <View style={styles.socialsDiv}>
                <Text onPress={() => Linking.openURL(mentorTgUrl)}> 
                  <Image style={styles.socials} source={ require("./assets/telegram.png") }/> 
                </Text>
                <Text onPress={() => Linking.openURL(mentorVibUrl)}> 
                  <Image style={styles.socials} source={ require("./assets/viber.png") } />
                </Text>
                
            </View>

          </View>

        </View>

        <Text style={[styles.black,styles.font24]}>Менеджер</Text>
        <View style={styles.profileSector}>

          <Image style={styles.profileSectorImage} source={ require("./assets/wit_picture.png") }/>
          <View style={styles.profileSectorRight} >

            <Text style={[styles.black,styles.font20]}>{menejerName}</Text>
            <Text style={[styles.orange,styles.font16]}>{menejerNumber}</Text>
            <View style={styles.socialsDiv}>
                <Text onPress={() => Linking.openURL(menejerTgUrl)}> 
                  <Image style={styles.socials} source={ require("./assets/telegram.png") }/> 
                </Text>
                <Text onPress={() => Linking.openURL(menejerVibUrl)}> 
                  <Image style={styles.socials} source={ require("./assets/viber.png") } />
                </Text>
            </View>

          </View>

        </View>

      </View>
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
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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
    padding: "0 0 10px 0",
    gap: 20,

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

