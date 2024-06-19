import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import {url, styles} from "../App.js"

export default function Modules({ navigation }) {
  
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
                      <Image style={styles.lockImage} source={ require("../assets/unlocked.png") }/>
                    </View>
                  </TouchableOpacity>
              )} else{
                return(
                  <View style={styles.lockedModuleButton} key={idx}>
                    <Text style={[styles.white,styles.font20,{maxWidth:"80%",wordBreak: "break-word"}]}>{module.name}</Text>
                    <View style={styles.ModuleButtonRight}>
                      <Text style={[styles.white,styles.font20]}>0</Text>
                      <Image style={styles.lockImage} source={ require("../assets/locked.png") }/>
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
  