import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanelTest from "../components/navPanelTest"
import FullWidthImage from "../components/fullWidthImage"
import {url, styles} from "../App.js"

export default function WordTest ({ navigation, route}){
    const [error, setError] = useState()
    const testId = route.params.id
    const [task, setTask] = useState()
    const [questions, setQuestions] = useState()
    const [wordList, setWordList] = useState()
    const [questionProgress, setQuestionProgress] = useState()
    const [module, setModule] = useState()
    const [questionStatuses, setQuestionStatuses] = useState()
    const [completed, setCompleted] = useState(false)
    const [listOfIdKeys, setListOfIdKeys] = useState([])
    const [randomWordList, setRandomWordList] = useState()
    const [wordsCounters, setWordsCounters] = useState()
  

    let groupedQuestions

    let [answerStyle, setAnswerStyle] = useState([styles.white, styles.font20])
    const [answer, setAnswer] = useState("")
    let answersList = []

    function shuffleAnswers(arr) {
      arr.sort(() => Math.random() - 0.5);
    }

    function groupByWordId(arr) {
        return arr.reduce((acc, obj) => {
            const { wordId } = obj;
            if (!acc[wordId]) {
                acc[wordId] = [];
            }
            acc[wordId].push(obj);
            return acc;
        }, {});
    };

    function getRandomElement(array) {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * array.length);
        // Use array destructuring to directly extract the random element
        const randomElement = array[randomIndex];
        return randomElement;
    }
    
    
    async function getInfoOfTask() {
      fetch(`${url}/tasks/${testId}`,{
        method: "GET",
        headers:{
          "token": await AsyncStorage.getItem('apikey')
        }
      })
      .then(response => response.json())
      .then(
        async data => {
          if (!data.error){
              
            console.log(data)
            setTask(await data.task)

            groupedQuestions = await groupByWordId(data.data);

            setQuestions(groupedQuestions)
            console.log(groupByWordId(data.data))
            console.log(await groupByWordId(data.data)[getRandomElement(Object.keys(groupByWordId(data.data)))])
            // console.log(groupByWordId(data.data)[1])
            setListOfIdKeys(Object.keys(groupByWordId(await data.data)))
            setRandomWordList(getRandomElement(Object.keys(groupByWordId(await data.data))))
            setWordList(await data.words)
            setModule(await data.module)
            setQuestionProgress(await data.progress)
            setCompleted(await data.progress.completed)
            setQuestionStatuses(await data.questionsStatuses)
            setAnswerStyle([styles.white, styles.font20])
            
            getWordCounters()

            if(data.progress.progress > data.data.length){
              completeTask()
              navigation.navigate("Modules")
            }
          }else{
            setError(data.error)
          }
  
        }
      )
      
    }
  
    async function updateProgresId(newProg, correct) {
      if (correct){
          fetch(`${url}/taskProgress/${testId}/${newProg}/${correct}`,{
            method: "PUT",
            headers:{
              "token": await AsyncStorage.getItem('apikey')
            }
          })
          .then(response => response.json())
          .then(
            async data => {
              setQuestionProgress(await data.progress.progress)
              getInfoOfTask()
    
              console.log(data.progress.progress)
              
              if(await questionProgress.progress > await questions.length){
                navigation.navigate("Modules")
              }
            }
          )
      }
      aaad = Number(getRandomElement(listOfIdKeys))
      setRandomWordList(Number(getRandomElement(listOfIdKeys)))
    }
  
  
    async function getWordCounters(){
        fetch(`${url}/wordCounters`,{
          method: "GET",
          headers:{
            "token": await AsyncStorage.getItem('apikey')
          }
        })
        .then(response => response.json())
        .then(
          async data => {
            setWordsCounters(await data)
            console.log(data)
            console.log("gdhfgikjhhfjyuiokljfuiolkgffuiolk")
            console.log(groupedQuestions)
            // console.log(groupedQuestions[aaad])
          }
        )
      }
  
    async function completeTask(){
      fetch(`${url}/complete/${testId}`,{
        method: "PUT",
        headers:{
          "token": await AsyncStorage.getItem('apikey')
        }
      })
      .then(response => response.json())
      .then(
        async data => {
          setCompleted(true)
        }
      )
    }
  
    
    useEffect(()=>{getInfoOfTask()},[testId])
    // useEffect(()=>{getWordCounters()},[])
    return(
      <View style={styles.profileContainer}>
        <View style={[styles.orangeBG,{width: "100%", height: 30}]}></View>
        {!questions && !questionProgress && !error &&
        
          <View style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>
            <ActivityIndicator size="large" color="#e19a38"/>
          </View>
        }
  
        {error &&
          <View style={{height: '100%',width: "100%", alignItems: "center", justifyContent: "center"}}>
            <View style={{width: '90%', height: "20%", backgroundColor: '#252124',borderColor: '#E19A38',borderWidth: 2,borderRadius: 15, justifyContent: 'space-evenly',alignItems: 'center'}}>
              <Text style={{fontSize: 24, color: "#E19A38"}}>Виникла помилка!</Text>
              <Text style={{color: 'white', fontSize: 20}}>{error}</Text>
              <TouchableOpacity style={{width: '90%',height:'30%',backgroundColor: '#3B3B3B',borderColor: '#4F4F4F',borderWidth: 2,borderRadius: 15,justifyContent: 'center', alignItems: 'center'}} onPress={()=>{navigation.goBack()}}>
                <Text style={{color: 'white', fontSize: 20}}>Повернутися назад</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
  
        {questions && questionProgress && questionProgress.progress && randomWordList && wordsCounters &&
        <View style={{width: '100%', height: '90%', justifyContent: 'space-around', alignItems: 'center'}}>
          
          { questionStatuses &&
            <Text style={{color: 'white', textAlign: 'center', fontSize: 32}}>{questionProgress.progress}/{questionStatuses.length}</Text>
          }
          { questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].extraQuestionText &&
            <Text style={[styles.white, styles.font20]}>{questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].extraQuestionText}</Text>
          }
          { questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].imagePath &&
            <FullWidthImage imageUrl={questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].imagePath}/>
          }
          { questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].question && 
            <Text style={[styles.white, styles.font24]}>{questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].question}</Text>
          }
          
          <View style={styles.viewForAnswers}>
            { questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].wrongAnswers.map((answer, idx) =>{
              answersList.push(answer)
              if (!answersList.includes(questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].trueAnswers[0])){
                answersList.push(questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].trueAnswers[0])
              }
              shuffleAnswers(answersList)
            })}
            {answersList.map((ans, idx) =>{
                let answerStyleExtra = []
                if (questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].trueAnswers[0] == ans){
                  answerStyleExtra = answerStyle
                } else{
                  answerStyleExtra = [styles.white, styles.font20]
                }
                return(
                <TouchableOpacity key={idx} style={styles.buttonAnswer} onPress={()=>{
                  correct = false
                  setAnswerStyle([styles.red, styles.font20])
                  if (ans == questions[randomWordList][wordsCounters.usersWords[randomWordList].counter].trueAnswers[0]){
                    correct = true
                    setAnswerStyle([styles.orange, styles.font20])
                  }
                  updateProgresId(questionProgress.progress+1,correct)
                  }}>
                  <Text style={[styles.white,answerStyleExtra]}>{ans}</Text>
                </TouchableOpacity>
                )
            })}
          </View>
        </View>
        }
  
        {questions && questionProgress && questionProgress.progress &&
          <NavigationPanelTest word={true} module={route.params.moduleName} wordList={wordList} navigation={navigation}/>
        }
      </View>
    )
  }
  