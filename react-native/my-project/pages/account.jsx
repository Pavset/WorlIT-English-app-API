import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanel from "../components/navPanel"
import {url, styles} from "../App.js"



export default function Account({navigation}){
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
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
  
    useEffect(()=>{getProfile()},[])
  
    async function clearAsyncStorage() {
      AsyncStorage.clear();
      await navigation.navigate("Register")
    }
  
    if (userData ){
      return(

        <View style={styles.profileContainer}>
          
          <View style={styles.profileUp}>
            <Text style={[styles.white,styles.font32]}>Профіль</Text>
          </View>
          <ScrollView style={styles.scroll100}>
  
            <View style={styles.profileMid}>
              <Image style={styles.avatar} source={ require("../assets/account.png") }/>

                <Text style={[styles.orange,styles.font24]}>{userData.name} {userData.surname}</Text>

              
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
                        <Image style={styles.socials} source={ require("../assets/telegram.png") }/> 
                      </Text>
                      <Text onPress={() => Linking.openURL(teacherData.viber)}> 
                        <Image style={styles.socials} source={ require("../assets/viber.png") } />
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
                        <Image style={styles.socials} source={ require("../assets/telegram.png") }/> 
                      </Text>
                      <Text onPress={() => Linking.openURL(managerData.viber)}> 
                        <Image style={styles.socials} source={ require("../assets/viber.png") } />
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
          <ActivityIndicator size="large" color="#e19a38"/>
          
          <NavigationPanel navigation={navigation}/>
        </View>
      )
    }
  
  }
  
