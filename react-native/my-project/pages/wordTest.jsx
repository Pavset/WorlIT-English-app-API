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
    const [completed, setCompleted] = useState(false)
    const [randomWordListId, setRandomWordListId] = useState()
    const [wordsCounters, setWordsCounters] = useState()
    const [qqq, setqqq] = useState()

    let groupedQuestions
    let qStat
    const [answerStyle, setAnswerStyle] = useState([styles.white, styles.font20])
    let answersList = [] 
    let rdNew 


    function shuffleAnswers(arr) {
      arr.sort(() => Math.random() - 0.5);
    }

    function groupByWordId(arrayOfQuestions) {
        return arrayOfQuestions.reduce((acc, obj) => {
            const { wordId } = obj;
            if (!acc[wordId]) {
                acc[wordId] = [];
            }
            acc[wordId].push(obj);
            return acc;
        }, {});
    };

    function uncompletedQPonly(allQuestions, statusesOfQuestions){
      for (let id of Object.keys(allQuestions)){

        let counter = allQuestions[id].length

        for (let question of allQuestions[id]){

          for(let statId of statusesOfQuestions){
            if (question.id == statId.QuestionId){
              if(statId.correct){
                counter -= 1
              }
            }
          }

        }

        if (counter == 0){
          delete allQuestions[id]
        }
      }
      if (Object.keys(allQuestions).length > 0 || allQuestions != null){
        return allQuestions
      } else{
        completeTask()
        navigation.navigate("Modules")
      }
    }

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
            setTask(await data.task)

            groupedQuestions = await groupByWordId(data.data);
            qStat = await data.questionsStatuses

            groupedQuestions = uncompletedQPonly(groupedQuestions, qStat)
            setQuestions(groupedQuestions)
            if(Object.keys(groupedQuestions).length <= 0 || await groupedQuestions == null){
              completeTask()
              navigation.navigate("Modules")
            } 
            let rd = getRandomElement(Object.keys(await groupedQuestions))
            
            setRandomWordListId(rd)
            setWordList(await data.words)
            setQuestionProgress(await data.progress)
            setCompleted(await data.progress.completed)

            setAnswerStyle([styles.white, styles.font20])
            let usWords = data.usersWords
            setWordsCounters(data.usersWords)

            await usWords.map((elem,key)=>{
              if(elem.WordId == rd){
                rdNew = key
              }
            })

            setqqq(rdNew)

            if(data.progress.progress > data.data.length){
              completeTask()
              navigation.navigate("Modules")
            }

          }else{
            setError(data.error)
          }
  
        }
      )
      .catch(async (err)=>{
        console.error(err)
        await navigation.navigate("Error")
      })
    }
  
    async function updateProgresId(newProg, correct,wordId, questionId) {
      fetch(`${url}/taskProgress/${testId}/${newProg}/${correct}`,{
        method: "PUT",
        headers:{
          "token": await AsyncStorage.getItem('apikey'),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wordId: wordId,
          questionId: questionId
        })
      })
      .then(response => response.json())
      .then(
        async data => {
          setQuestionProgress(await data.progress.progress)
          getInfoOfTask()
          if(await questionProgress.progress > await questions.length){
            navigation.navigate("Modules")
          }
        }
      )
      .catch(async (err)=>{
        console.error(err)

        await navigation.navigate("Error")
      })
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
      .catch(async (err)=>{
        console.error(err)
        await navigation.navigate("Error")
      })
    }
    useEffect(()=>{getInfoOfTask()},[testId])
    return(
      <View style={styles.profileContainer}>
        <View style={[styles.orangeBG,{width: "100%", height: 30}]}></View>
        {!questions || !questionProgress || !error || !wordsCounters &&
        
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
   
        {questions && questionProgress && randomWordListId && wordsCounters && 
        <View style={styles.questionsView}>
          <View style={styles.viewForQuestions}>
            { questions && wordsCounters && wordsCounters[qqq].counter && questions[randomWordListId] &&
              <View style={styles.viewForCounter}>
                { questions[randomWordListId].map((question, idx)=>{
                  if (idx < wordsCounters[qqq].counter-1){
                    return (
                      <Image source={require("../assets/EllipseFull.png")} width={22} height={22}/>
                    )
                  } else{
                    return (
                      <Image source={require("../assets/EllipseEmpty.png")} width={22} height={22}/>
                    )
                  }
                })}
              </View>
            }
            { questions && wordsCounters && questions[randomWordListId][wordsCounters[qqq].counter-1].extraQuestionText && 
              <Text style={[styles.white, styles.font20]}>{questions[randomWordListId][wordsCounters[qqq].counter-1].extraQuestionText}</Text>
            }
            { questions && wordsCounters && questions[randomWordListId][wordsCounters[qqq].counter-1].imagePath &&
              <FullWidthImage imageUrl={questions[randomWordListId][wordsCounters[qqq].counter-1].imagePath}/>
            }
            { questions && wordsCounters && questions[randomWordListId][wordsCounters[qqq].counter-1].question && 
              <Text style={[styles.white, styles.font24]}>{questions[randomWordListId][wordsCounters[qqq].counter-1].question}</Text>
            }
          </View>
          
          <View style={styles.viewForAnswers}>
            { questions[randomWordListId][wordsCounters[qqq].counter-1].wrongAnswers.map((answer, idx) =>{
              answersList.push(answer)
              if (!answersList.includes(questions[randomWordListId][wordsCounters[qqq].counter-1].trueAnswers[0])){
                answersList.push(questions[randomWordListId][wordsCounters[qqq].counter-1].trueAnswers[0])
              }
              shuffleAnswers(answersList)
            })}
            {answersList.map((ans, idx) =>{
                let answerStyleExtra = []
                if (questions[randomWordListId][wordsCounters[qqq].counter-1].trueAnswers[0] == ans){
                  answerStyleExtra = answerStyle
                } else{
                  answerStyleExtra = [styles.white, styles.font20]
                }
                return(
                <TouchableOpacity key={idx} style={styles.buttonAnswer} onPress={()=>{
                  let correct = false
                  let questionProg = questionProgress.progress
                  setAnswerStyle([styles.red, styles.font20])
                  if (ans == questions[randomWordListId][wordsCounters[qqq].counter-1].trueAnswers[0]){
                    correct = true
                    questionProg = questionProgress.progress+1
                    setAnswerStyle([styles.orange, styles.font20])
                  }
                  updateProgresId(questionProg, correct, wordsCounters[qqq].WordId, questions[randomWordListId][wordsCounters[qqq].counter-1].id)
                  }}>
                  <Text style={[styles.white,answerStyleExtra]}>{ans}</Text>
                </TouchableOpacity>
                )
            })}
          </View>
        </View>
        }
  
        {questions && 
          <NavigationPanelTest word={true} module={route.params.moduleName} wordList={wordList} navigation={navigation}/>
        }
      </View>
    )
  }
  