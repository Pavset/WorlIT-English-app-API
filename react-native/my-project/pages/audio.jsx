import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanelTest from "../components/navPanelTest"
import AudioBar from '../components/playTrack';
import {url, styles} from "../App.js"


export default function AudioPage({navigation, route}){

    const mediaAudioId = route.params.id
    const [AudioSRC, setAudioSRC] = useState()
    const [wordList, setWordList] = useState()
    const [module, setModule] = useState()
    
    async function handleSubmit() {
      fetch(`${url}/tasks/${mediaAudioId}`,{
        method: "GET",
        headers:{
          "token": await AsyncStorage.getItem('apikey')
        }
      })
      .then(response => response.json())
      .then(
        async data => {
          setAudioSRC(await data.data.audio)
          setWordList(data.words)
          setModule(await data.module)
        }
      )
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
    useEffect(()=>{handleSubmit()},[mediaAudioId])
    
  
    return(
      <View style={styles.audioContainer}>
        {!AudioSRC &&
                  <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                  <ActivityIndicator size="large" color="#e19a38"/>
                  </View>
        }
  
        {AudioSRC &&
        <AudioBar url ={AudioSRC}/>
        }
        
        {AudioSRC &&
        <NavigationPanelTest word={true} module={route.params.moduleName} wordList={wordList} navigation={navigation}/>
        }
        
      </View>
    )
  }
  