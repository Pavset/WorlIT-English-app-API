import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanel from "../components/navPanel"
import {url, styles} from "../App.js"

export default function Home({navigation}){
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
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
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
         SetListOfTopicsId(await data)
        }
      )
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
  
  
    return(
      <View>
        <Text>2ertyhju/xt</Text>
        <Text></Text>
  
        <NavigationPanel navigation={navigation}/>
      </View>
    )
    
  }
  