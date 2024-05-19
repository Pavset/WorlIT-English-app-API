import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
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

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen options={{headerShown: false}} name="Login" component={Login}/>
      <Stack.Screen options={{headerShown: false}} name="Register" component={Register}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

