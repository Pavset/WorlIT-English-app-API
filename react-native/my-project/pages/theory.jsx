import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanelTest from "../components/navPanelTest"
import FullWidthImage from "../components/fullWidthImage"
import {url, styles} from "../App.js"

export default function Theory({ navigation, route }) {
    const theoryId = route.params.id
    const [theory, setTheory] = useState([])
    const [sections, setSections] = useState()
    async function handleSubmit() {
      fetch(`${url}/theories/${theoryId}`,{
        method: "GET",
        headers:{
          "token": await AsyncStorage.getItem('apikey')
        }
      })
      .then(response => response.json())
      .then(
        async data => {
          setTheory(await data.info)
          setSections(await data.sections)
        }
      )
      .catch(async (err)=>{
        await navigation.navigate("Error")
      })
    }
  
    function replaceHighlighting(text){
      const regex = /~(.*?)~/g;
    
      // Using regular expression to replace ~...~ with <Text> components in React Native
      const parts = [];
      let lastIndex = 0;
    
      text.replace(regex, (match, p1, offset) => {
        // Add text up to the current match
        if (offset > lastIndex) {
          parts.push(text.substring(lastIndex, offset));
        }
        // Add the selected text as a <Text> component
        parts.push(<Text style={[styles.orange, styles.font16]}>{p1.trim()}</Text>);
        // Updating the last index
        lastIndex = offset + match.length;
      });
    
      // Add the remaining text after the last match
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
    
      return parts;
    };
  
    useEffect(()=>{handleSubmit()},[theoryId])
  
    return(
      <View style={styles.profileContainer}>
      <View style={[styles.orangeBG,{width: "100%", height: 30}]}></View>
      <ScrollView style={[styles.scroll100,{padding: 10, marginBottom:90}]}>
        <View style={[styles.theorySection, styles.theoryTitle]}>
          <Text style={[styles.orange, styles.font40]}>{theory.name}</Text>
        </View>
        { !sections &&
          <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
          <ActivityIndicator size="large" color="#e19a38"/>
          </View>
        }
        { sections &&
          <View style={styles.theorySection}>
            { sections.map((section, idx) =>{
              let highlightedText = replaceHighlighting(section.text);
              return(
                <View style={{gap: 15}} key={idx}>
                  { section.title &&
                    <Text style={[styles.orange, styles.font24]}>{section.title}</Text>
                  }
                  
                  <Text style={[styles.white, styles.font16,{width:"100%",wordBreak: "break-word"}]}>
                    {highlightedText.map((part, index) => (
                      typeof part === 'string' ? <Text>{part}</Text> : part
                    ))}
                  </Text>
                  { section.imagePath &&
                    <FullWidthImage imageUrl={section.imagePath}/>
                  }
                </View>
              )
            })}
          </View>
        }
      </ScrollView>
  
      <NavigationPanelTest word={false} navigation={navigation}/>
    </View>
    )
  }