import { Text, View, TouchableOpacity, Image } from 'react-native';
import {url, styles} from "../App.js"

export default function Error({navigation}) {
  async function handleSubmit(){
    fetch(`${url}/`, {
      method: "GET"
    })
    .then((response)=> response.json())
    .then(
      async data =>{
        await navigation.replace("Account")
      }
    )
    .catch(async (err)=>{
      await navigation.navigate("Error")
    })
  }


    return(
      <View style={styles.container}>
          <View style={styles.header}>
              <Text style={[styles.orange,styles.font40]}>WORLD</Text>
              <Text style={[styles.white,styles.font40]}>IT</Text>
          </View>
  
          <View style={[styles.mainRegLog,{columnGap: 10}]}>
              <Image
                source={{
                  uri:"data:image/png;base64,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"
                }}
                style={{width: 100, height: 100}}
              />
              
              <Text style={[styles.white, styles.font24]}>Немає підключення до серверу</Text>
              <TouchableOpacity style={styles.orangeButton} onPress={()=>{handleSubmit()}}><Text style={[styles.black, styles.font24]}>Повторити</Text></TouchableOpacity>
          </View>

      </View>
    )
  }
  