import { StyleSheet, View, Pressable, Image } from 'react-native';

export default function NavigationPanelTest({word,navigation, wordList,module}){
  if (word){
    return(
      <View style={styles.navBar}>
        <Pressable style={styles.button} onPress={()=>{navigation.navigate("Modules")}}>
          <Image style={styles.buttonImage} source={{ uri: "https://i.postimg.cc/yDjWf9xt/icons8-back-96.png" }}/>
        </Pressable >
        <Pressable style={styles.button} onPress={()=>{navigation.navigate("Words",{words : wordList, moduleName: module})}}>
          <Image style={styles.buttonImage} source={{ uri: "https://i.postimg.cc/zVnyg4rJ/icons8-document-96.png" }}/>
        </Pressable >
      </View>
  )
  }else{
    return(
      <View style={styles.navBar}>
        <Pressable style={styles.button} onPress={()=>{navigation.goBack()}}>
          <Image style={styles.buttonImage} source={{ uri: "https://i.postimg.cc/yDjWf9xt/icons8-back-96.png" }}/>
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