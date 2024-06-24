import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import {url, styles} from "../App.js"

export default function Login({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
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
      setLoading(true)
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
            setError("Ви не увели ім'я")
            setLoading(false)
          } else{
            setLoading(false)
            setError(data.error)
          }
        } else {
          try {
            await AsyncStorage.setItem('apikey', `${data.apikey}`);
          } catch (error) {
            setError("Не вдалося зберегти токен у сховищі")
            setLoading(false)
          } finally {
            setError("")
            setLoading(false)
            navigation.replace("Account")
          }
        }
      })
      .catch(async (err)=>{
        setLoading(false)
        await navigation.navigate("Error")
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
  
            <Text style={[styles.white,styles.font32]}>Вхід</Text>
            <TextInput 
              style={styles.input}
              placeholder="Ім'я"
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
            {error &&
            <Text style={[styles.orange, styles.font24]}>{error}</Text>
            }
            {!loading &&
              <TouchableOpacity style={styles.orangeButton} disabled={loading} onPress={()=>{handleSubmit()}}><Text style={[styles.black, styles.font24]}>Увійти</Text></TouchableOpacity>
            }
            {loading &&
              <TouchableOpacity style={styles.orangeButton} disabled={loading}><ActivityIndicator size="large" color="#000000"/></TouchableOpacity>
            }
          </View>
  
  
          <TouchableOpacity style={styles.goToRegLog} onPress={()=>{navigation.navigate("Register")}}><Text style={[styles.white, styles.font20]}>Немає акаунту?</Text></TouchableOpacity>
        
        </View>
      </View>
    )
  }
  