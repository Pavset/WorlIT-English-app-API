import { StyleSheet, View, Pressable, Image} from 'react-native';

export default function NavigationPanel({navigation}){
    return(
        <View style={styles.navBar}>
          <Pressable style={styles.button} onPress={()=>{navigation.navigate("Modules")}}>
            <Image style={styles.buttonImage} source={{ uri: "https://i.postimg.cc/68tyLzWC/icons8-book-96.png" }}/>
          </Pressable >
          <Pressable style={styles.button} onPress={()=>{navigation.navigate("Account")}}>
            <Image style={styles.buttonImage} source={ require("../assets/profile.png") }/>
          </Pressable >
        </View>
    )
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
      padding:12,
      bottom:-1,
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