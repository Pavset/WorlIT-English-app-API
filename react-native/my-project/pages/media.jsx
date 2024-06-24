import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanelTest from "../components/navPanelTest"
import VideoScreen from "../components/video"
import {url, styles} from "../App.js"

export default function Media ({ navigation, route}){
    const [mediaUrl,setMediaUrl] = useState()
    const mediaId = route.params.id
    const [wordList, setWordList] = useState()
    const [module, setModule] = useState()
  
  
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
          if (!data.error){
            if (data.data.type == 'video'){
              setMediaUrl(data.data.video)
            } else if (data.data.type == 'audio'){
              setMediaUrl(data.data.audio)
            }
            setWordList(data.words)
            setModule(await data.module)
          }
  
        }
      )
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
  
    useEffect(()=>{handleSubmit()},[mediaId])
  
    return(
      <View style={styles.profileContainer}>
        
        {!mediaUrl &&
                  <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                  <ActivityIndicator size="large" color="#e19a38"/>
                  </View>
        }
        {mediaUrl &&
           <VideoScreen videoSource={mediaUrl}/>
        }
        
        {mediaUrl &&
          <NavigationPanelTest word={true} module={route.params.moduleName} wordList={wordList} navigation={navigation}/>
        }
        
        
      </View>
    )
  }
  