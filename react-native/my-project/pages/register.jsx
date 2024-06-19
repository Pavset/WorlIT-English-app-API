import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import MaskInput from 'react-native-mask-input';
import {url, styles} from "../App.js"

export default function Register({navigation}) {
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
  