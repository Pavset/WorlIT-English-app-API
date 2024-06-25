import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanel from "../components/navPanel"
import {url, styles} from "../App.js"

export default function ModulePage({ navigation, route }){

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
        }
      )
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
  
    function modal(redirect,task){
      SetModalRedirect(redirect)
      SetModalRedirectId(task)
      if(modalOpened){
        SetModalOpened(false)
      } else{
        SetModalOpened(true)
      }
    }
    
    async function downgradeTask(task) {
      
      fetch(`${url}/taskProgress/${task}/${1}/false`,{
        method: "PUT",
        headers:{
          "token": await AsyncStorage.getItem('apikey')
        }
      })
      .then(response => response.json())
      .then(
        async data => {
          navigation.navigate( modalRedirect,{id: modalRedirectId,moduleName: moduleInfo.name} )
        }
      )
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
  
  
    useEffect(()=>{getModuleInfo()},[])
  
    return(
      <View style={styles.profileContainer}>
        {modalOpened &&
        <TouchableOpacity style={styles.modalWraper} onPress={modal}>
          <View style={[styles.modal,{justifyContent: 'space-around'}]}>
            <Text style={[styles.white,styles.font24]}>Чи перепроходити завдання?</Text>
            <View style={{width: '100%', flexDirection: "row", justifyContent: 'space-around', alignItems: 'center', height: 50}}>
            <TouchableOpacity  onPress={()=>{
              downgradeTask(modalRedirectId)
              }}>
                <Text style={[styles.white,styles.font20]}>Так</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={modal}>
                <Text style={[styles.white,styles.font20]}>Ні</Text>
            </TouchableOpacity>
            </View>
            
  
          </View>
          
        </TouchableOpacity>
        }
        <View style={styles.header}>
          <Text style={[styles.white,styles.font32]}>{moduleInfo.name}</Text>
        </View>
        {!topics && !taskStatuses &&
            <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
            <ActivityIndicator size="large" color="#e19a38"/>
            </View>
        }
        { topics && taskStatuses &&
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
                            <Image style={styles.taskButtonImg} source={ require("../assets/book2.png") }/>
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
                        typeImage = require("../assets/video.png")
                        typeText = "video"
                        media = true
                        redirect = "Media"
                        videoCounter += 1
                        counter = videoCounter
                      } else if (task.type == "test"){
                        typeImage = require("../assets/test.png")
                        typeText = "test"
                        testCounter += 1
                        counter = testCounter
                      } else if (task.type == "words"){
                        typeImage = require("../assets/words.png")
                        redirect = "WordTest"
                        typeText = "words"
                        wordsCounter += 1
                        counter = wordsCounter
                      } else if (task.type == "routes"){
                        typeImage = require("../assets/routes.png")
                        typeText = "routes"
                        routesCounter += 1
                        counter = routesCounter
                      } else if (task.type == "sentences"){
                        typeImage = require("../assets/sentences.png")
                        typeText = "sentences"
                        sentencesCounter += 1
                        counter = sentencesCounter
                      } else if (task.type == "audio"){
                        typeText = "audio"
                        typeImage = {uri: "https://img.icons8.com/ios/100/high-volume--v1.png"}
                        media = true
                        redirect = "AudioPage"
                        audioCounter += 1
                        counter = audioCounter
                      }

                      if(taskStatuses.blocked.includes(task.id)){
                        typeImage = require("../assets/lockedFile.png")
                        redirect = ""
                      } 
  
                      if(taskStatuses.completed.includes(task.id)){
                        completeStyle = styles.completedTask
                        modalOp = true
                      }
                      return(
                        
                          <TouchableOpacity style={[styles.taskButton,styles.antiIndexMargin]} key={idx} onPress={modalOp ? ()=>{modal(redirect,task.id)} : ()=>{navigation.navigate( redirect,{id: task.id,moduleName: moduleInfo.name} )}}>
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
                      let modalOp = false

                      
                      if (work.type == "video"){
                        typeImage = require("../assets/video.png")
                        typeText = "video"
                        media = true
                        redirect = "Media"
                        videoCounter += 1
                        counter = videoCounter
                      } else if (work.type == "test"){
                        typeImage = require("../assets/test.png")
                        typeText = "test"
                        testCounter += 1
                        counter = testCounter
                      } else if (work.type == "words"){
                        typeImage = require("../assets/words.png")
                        redirect = "WordTest"
                        typeText = "words"
                        wordsCounter += 1
                        counter = wordsCounter
                      } else if (work.type == "routes"){
                        typeImage = require("../assets/routes.png")
                        typeText = "routes"
                        routesCounter += 1
                        counter = routesCounter
                      } else if (work.type == "sentences"){
                        typeImage = require("../assets/sentences.png")
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
                        typeImage = require("../assets/lockedFile.png")
                        redirect = ""
                      } 
                      
  
                      if(taskStatuses.completed.includes(work.id)){
                        completeStyle = styles.completedTask
                        modalOp = true
                      }
  
  
                      return(
                          <TouchableOpacity style={[styles.taskButton,styles.antiIndexMargin]} key={idx} onPress={modalOp ? ()=>{modal(redirect,work.id)} : ()=>{navigation.navigate( redirect,{id: work.id,moduleName: moduleInfo.name} )}}>
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
  