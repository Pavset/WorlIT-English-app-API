import { StyleSheet, Text, View, LogBox, TouchableOpacity, TextInput, Image, Linking, ScrollView, StatusBar,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import NavigationPanelTest from "../components/navPanelTest"
import FullWidthImage from "../components/fullWidthImage"
import {url, styles} from "../App.js"

export default function Test ({ navigation, route}){
    const [error, setError] = useState()
    const testId = route.params.id
    const [task, setTask] = useState()
    const [questions, setQuestions] = useState()
    const [wordList, setWordList] = useState()
    const [questionProgress, setQuestionProgress] = useState()
    const [module, setModule] = useState()
    const [questionStatuses, setQuestionStatuses] = useState()
    // const [questionType, setQuestionType] = useState()
  
    let [answerStyle, setAnswerStyle] = useState([styles.white, styles.font20])
  
    // for type "multiple" question
    let [sectionCounter,setSectionCounter] = useState(1)
    let [multipleAnswer, setMultipleAnswer] = useState([])
    let arrayOfQuestionSections =  {}
    let [dotsCounter,setDotsCounter] = useState(0)
    let [multipleString, setMultipleString] = useState("")
  
    // for type "input" question
    const [completed, setCompleted] = useState(false)
    const [answer, setAnswer] = useState("")
    let answersList = []
    function shuffleAnswers(arr) {
      arr.sort(() => Math.random() - 0.5);
    }
  
  
    //createAnswersForMultiple(questions[questionProgress.progress-1].wrongAnswers, idx)
    function createAnswersForMultiple(trueArr,trueAns,answersArr,idx){
      // let l = trueArr.length
      // тру ответы, но по новой
      let trueExtra = []
      for (let trueAnswer of trueArr){
        trueExtra.push(trueAnswer)
      }
    
      // выводим доп рандом ответ который будет получаться из правильных но не будет таковым в данный момент
      let trueIdx = trueExtra.indexOf(trueAns)
      trueExtra.splice(trueIdx, 1)
      let extraFromTrue = trueExtra[Math.floor(Math.random()*trueExtra.length)]
    
      // прост ответы, но по новой
      let ansArr = []
      for (let answer of answersArr){
        ansArr.push(answer)
      }
    
      // тот который в итоге выводим
      let tempArr = []
      ansArr.push(trueAns)
      ansArr.push(extraFromTrue)
      shuffleAnswers(ansArr)
      for (let ans of ansArr){
        
        if(!tempArr.includes(ans)){
          tempArr.push(ans)
        }
      }
      return tempArr
    }
  
    function arraysEqual(a, b) {
      return JSON.stringify(a)==JSON.stringify(b);
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
            setQuestions(await data.data)
            setWordList(await data.words)
            setModule(await data.module)
            setQuestionProgress(await data.progress)
            setCompleted(await data.progress.completed)
            setQuestionStatuses(await data.questionsStatuses)
            setAnswerStyle([styles.white, styles.font20])

            console.log(data)
            
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
  
        {questions && questionProgress && questionProgress.progress &&
        <View style={{width: '100%', height: '90%', justifyContent: 'space-around', alignItems: 'center'}}>
          { questionStatuses &&
            <Text style={{color: 'white', textAlign: 'center', fontSize: 32}}>{questionProgress.progress}/{questionStatuses.length}</Text>
          }
          {/* <Text>{questions[questionProgress.progress-1].question}</Text> */}
          { questions[questionProgress.progress-1].extraQuestionText &&
            <Text style={[styles.white, styles.font20]}>{questions[questionProgress.progress-1].extraQuestionText}</Text>
          }
          { questions[questionProgress.progress-1].imagePath &&
            <FullWidthImage imageUrl={questions[questionProgress.progress-1].imagePath}/>
          }
          { questions[questionProgress.progress-1].question && dotsCounter > 0 &&
            <View>
              <Text style={[styles.white, styles.font24]}>{multipleString}</Text>
              <TouchableOpacity onPress={()=>{
                let word = multipleAnswer.slice(-1)
                multipleAnswer.pop()
                let multipleTemp = []
                for (let temp of multipleAnswer){
                  multipleTemp.push(temp)
                }
                let tempString = multipleString.replace(word,"...")
                setSectionCounter(sectionCounter-1)
                setMultipleAnswer(multipleTemp)      
                setMultipleString(tempString)
              }}>
                Remove
              </TouchableOpacity>
            </View> 
          }
          { questions[questionProgress.progress-1].question && dotsCounter <= 0 &&
              <Text style={[styles.white, styles.font24]}>{questions[questionProgress.progress-1].question}</Text>
          }
          { multipleAnswer && questions[questionProgress.progress-1].questionType == "multiple" && !questions[questionProgress.progress-1].question && 
            <View>
              <Text style={[styles.white, styles.font24]}>{multipleAnswer.join(' ')}</Text>
              {multipleAnswer.length > 0 &&
              <TouchableOpacity onPress={()=>{
                let word = multipleAnswer.slice(-1)
                multipleAnswer.pop()
                let multipleTemp = []
                for (let temp of multipleAnswer){
                  multipleTemp.push(temp)
                }
                let tempString = multipleString.replace(word,"...")
                setSectionCounter(sectionCounter-1)
                setMultipleAnswer(multipleTemp)      
                setMultipleString(tempString)   
              }}>
                Remove
              </TouchableOpacity>
              }
            </View> 
          }
          { questions[questionProgress.progress-1].questionType == "word" &&
            <View style={styles.viewForAnswers}>
              { questions[questionProgress.progress-1].wrongAnswers.map((answer, idx) =>{
                answersList.push(answer)
                if (!answersList.includes(questions[questionProgress.progress-1].trueAnswers[0])){
                  answersList.push(questions[questionProgress.progress-1].trueAnswers[0])
                }
                shuffleAnswers(answersList)
              })}
              {answersList.map((ans, idx) =>{
                  let answerStyleExtra = []
                  if (questions[questionProgress.progress-1].trueAnswers[0] == ans){
                    answerStyleExtra = answerStyle
                  } else{
                    answerStyleExtra = [styles.white, styles.font20]
                  }
                  return(
                  <TouchableOpacity key={idx} style={styles.buttonAnswer} onPress={()=>{
                    correct = false
                    setAnswerStyle([styles.red, styles.font20])
                    if (ans == questions[questionProgress.progress-1].trueAnswers[0]){
                      correct = true
                      setAnswerStyle([styles.orange, styles.font20])
                    }
  
                    updateProgresId(questionProgress.progress+1,correct)
                    }}>
                    <Text style={[styles.white,answerStyleExtra]}>{ans}</Text>
                  </TouchableOpacity>
                  )
                })
              }
            </View>
          }
          { questions[questionProgress.progress-1].questionType == "input" &&
            <View style={styles.viewForAnswers}>
              <Text>Уведіть відповідь</Text>
              <TextInput 
                style={styles.input}
                value={answer}
                onChangeText={setAnswer}
                
              />
              <TouchableOpacity style={styles.buttonAnswer} onPress={ ()=>{
                let correct = false
                if(answer.length > 0){
                  if(answer.toLowerCase() == questions[questionProgress.progress-1].trueAnswers[0]){
                    correct = true
                  }
    
                  updateProgresId(questionProgress.progress+1,correct)
                } 
              }
              }>
                <Text style={[styles.white, styles.font20]}>Відповісти</Text>
              </TouchableOpacity>
            </View>
            
          }
          { questions[questionProgress.progress-1].questionType == "multiple" &&
            <View style={styles.viewForAnswers}>
              {questions[questionProgress.progress-1].trueAnswers.map((truAns, idx) =>{
                  arrayOfQuestionSections[idx] = createAnswersForMultiple(questions[questionProgress.progress-1].trueAnswers, truAns, questions[questionProgress.progress-1].wrongAnswers, idx)
  
              })}
              {arrayOfQuestionSections[sectionCounter-1].map((answer, idx)=>{
                return(
                  <TouchableOpacity key={idx} style={styles.buttonAnswer} onPress={()=>{
                    if (dotsCounter == 0){
                      setMultipleString(questions[questionProgress.progress-1].question)
                    }
                    let multipleTemp = []
                    for (let temp of multipleAnswer){
                      multipleTemp.push(temp)
                    }
                    multipleTemp.push(answer)
                    setMultipleAnswer(multipleTemp)

                    if(questions[questionProgress.progress-1].question){
                      let tempString
                      if (multipleString.length < 1){
                        tempString  = questions[questionProgress.progress-1].question
                      } else{
                        tempString = multipleString
                      }
                      setDotsCounter(dotsCounter+1)
                      let newString = tempString.replace("...", answer)
                      setMultipleString(newString)
                    }

                    if(multipleAnswer.length < questions[questionProgress.progress-1].trueAnswers.length-1){
                      setSectionCounter(sectionCounter+1)

                    } else{
                      let correct = false
                      if (arraysEqual(multipleTemp,questions[questionProgress.progress-1].trueAnswers)){
                        correct = true
                      }
                      updateProgresId(questionProgress.progress+1,correct)
                    }
                    }}>
                    <Text style={[styles.white, styles.font20]}>{answer}</Text>
                  </TouchableOpacity>
                  )
              })}
              
            </View>
          }
        </View>
        }
  
        {questions && questionProgress && questionProgress.progress &&
          <NavigationPanelTest word={true} module={route.params.moduleName} wordList={wordList} navigation={navigation}/>
        }
      </View>
    )
  }
  