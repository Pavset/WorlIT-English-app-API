import { StyleSheet, Text, View, LogBox, Pressable , TextInput, Image, Link } from 'react-native';

export default function NavigationPanelTest({word,navigation, wordList}){
  if (word){
    return(
      <View style={styles.navBar}>
        <Pressable style={styles.button} onPress={()=>{navigation.goBack()}}>
          <Image style={styles.buttonImage} source={ require("../assets/book.png") }/>
        </Pressable >
        <Pressable style={styles.button} onPress={()=>{navigation.navigate("Words",{words : worldList})}}>
          <Image style={styles.buttonImage} source={ require("../assets/profile.png") }/>
        </Pressable >
      </View>
  )
  }else{
    return(
      <View style={styles.navBar}>
        <Pressable style={styles.button} onPress={()=>{navigation.goBack()}}>
          <Image style={styles.buttonImage} source={ require("../assets/book.png") }/>
        </Pressable >
      </View>
  )
  }

}

const styles = StyleSheet.create({
    navBar: {
      position:"absolute",
      display:"flex",
      flex: 1,
      backgroundColor: '#252124',
      flexDirection:"row",
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
      padding:10,
      bottom:0,
      left:0,
      width:"100%",
      borderTopColor:"#E19A38",
      borderTopWidth:3
    },
    button:{
      // flex: 1,
      // display: "flex",
      backgroundColor: '#E19A38',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal:25,
      paddingVertical:10,
      borderRadius: 10,
      alignSelf:"baseline"
    },
    buttonImage:{
      width: 38,
      height:38
    }
  });