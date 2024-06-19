import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import NavigationPanelTest from "../components/navPanelTest"

import {url, styles} from "../App.js"

export default function Words({navigation, route}) {
    const words = route.params.words
    const moduleName = route.params.moduleName
    const [noun, setNouns] = useState([])
    const [adj, setAdjs] = useState([])
    const [verb, setVerbs] = useState([])
    const [other, setOthers] = useState([])
  
    useEffect(()=>{
      
      words.map((v,i)=>{
        if (v.role == 'Іменник'){
          setNouns(noun => [...noun, [v.word, v.translated]]);
        }else if (v.role == 'Прикметник'){
          setAdjs(adj => [...adj, [v.word, v.translated]]);
        }else if (v.role == "Дієслово"){
          setVerbs(verb => [...verb, [v.word, v.translated]]);
        }else{
          setOthers(other => [...other, [v.word, v.translated]]);
        }
      })
    },[words])
    return(
      <View style={styles.profileContainer}>
        <View style={{backgroundColor: "#252124", width: '100%', height: 50, justifyContent: 'center', alignItems: "center"}}>
          <Text style={{color: "white", fontSize: 24}}>{moduleName}</Text>
        </View>
        {!words &&
                  <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
                    <ActivityIndicator size="large" color="#e19a38"/>
                  </View>
        }
        {words && 
        
          
        
        
        <ScrollView style={styles.scroll100}>
          <View style={{width: "100%", height: '100%', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 20}}>
        {noun.length > 0 &&
          <View style={{width: "90%", flexDirection: "column", alignItems: 'center', justifyContent: 'center', gap: 20}}>
  
          <View style={styles.roleBorder}>
              <Text style={styles.roleText}>Іменник</Text>
          </View>
          {noun.map((v,i)=>(
            <View style={styles.roleExample}>
              <Text style={{color: 'white', fontSize: 16, width: '30%', textAlign: 'left'}}>{v[0]}</Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
              </View>
              <Text style={{color: 'white', fontSize: 16, width: '30%', textAlign: "right"}}>{v[1]}</Text>
            </View>
          ))}
          </View>
        }
              {adj.length > 0 &&
          <View style={{width: "90%", flexDirection: "column", alignItems: 'center', justifyContent: 'center', gap: 20}}>
  
          <View style={styles.roleBorder}>
              <Text style={styles.roleText}>Прикметник</Text>
          </View>
          {adj.map((v,i)=>(
            <View style={styles.roleExample}>
              <Text style={{color: 'white', fontSize: 16, width: '30%', textAlign: 'left'}}>{v[0]}</Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
              </View>
              <Text style={{color: 'white', fontSize: 16, width: '30%', textAlign: "right"}}>{v[1]}</Text>
            </View>
          ))}
          </View>
        }
              {verb.length > 0 &&
          <View style={{width: "90%", flexDirection: "column", alignItems: 'center', justifyContent: 'center', gap: 20}}>
  
          <View style={styles.roleBorder}>
              <Text style={styles.roleText}>Дієслово</Text>
          </View>
          {verb.map((v,i)=>(
            <View style={styles.roleExample}>
              <Text style={{color: 'white', fontSize: 16, width: '30%', textAlign: 'left'}}>{v[0]}</Text>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
                <Image source={{ uri:"https://i.postimg.cc/x1GJ8qSr/Ellipse-5.png"}} style={{width: 16, height: 16}}/>
              </View>
              <Text style={{color: 'white', fontSize: 16, width: '30%', textAlign: "right"}}>{v[1]}</Text>
            </View>
          ))}
          </View>
        }
        </View>
        </ScrollView>
        
        }
        <NavigationPanelTest word={false} navigation={navigation}/>
      </View>
    )
  }
  