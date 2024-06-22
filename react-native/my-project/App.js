import { StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Account from './pages/account';
import AudioPage from './pages/audio';
import Home from "./pages/home"
import Login from './pages/login';
import Media from "./pages/media"
import ModulePage from './pages/modulePage';
import Modules from './pages/modules';
import Register from './pages/register';
import Test from './pages/test';
import Theory from './pages/theory';
import Words from './pages/words';
import WordTest from "./pages/wordTest"
import Error from "./pages/error"
const Stack = createNativeStackNavigator()

export const url = `http://localhost:8000`//process.env.EXPO_PUBLIC_URL
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName='Account'>
      <Stack.Screen options={{headerShown: false}} name="Login" component={Login}/>
      <Stack.Screen options={{headerShown: false}} name="Register" component={Register}/>
      <Stack.Screen options={{headerShown: false}} name="Account" component={Account}/>
      <Stack.Screen options={{headerShown: false}} name="Home" component={Home}/>
      <Stack.Screen options={{headerShown: false}} name="Modules" component={Modules}/>
      <Stack.Screen options={{headerShown: false}} name="ModulePage" component={ModulePage}/>
      <Stack.Screen options={{headerShown: false}} name="Theory" component={Theory}/>
      <Stack.Screen options={{headerShown: false}} name="AudioPage" component={AudioPage}/>
      <Stack.Screen options={{headerShown: false}} name="Test" component={Test}/>
      <Stack.Screen options={{headerShown: false}} name="Media" component={Media}/>
      <Stack.Screen options={{headerShown: false}} name="Words" component={Words}/>
      <Stack.Screen options={{headerShown: false}} name="WordTest" component={WordTest}/>
      <Stack.Screen options={{headerShown: false}} name="Error" component={Error}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export const styles = StyleSheet.create({

  blackBG:{
    backgroundColor:"#252124"
  },
  blackLightBG:{
    backgroundColor:"#4F4F4F"
  },
  orangeBG:{
    backgroundColor:"#E19A38"
  },
  white:{
    color:"#fff",
  },
  black:{
    color:"#252124",
  },
  orange:{
    color: "#E19A38"
  },
  red:{
    color: "#E15638"
  },
  font40:{
    fontSize:40
  },
  font32:{
    fontSize:32
  },
  font24:{
    fontSize:24
  },
  font20:{
    fontSize:20
  },
  font16:{
    fontSize:16
  },
  orangeButton:{
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor:"#E19A38",
    borderRadius: 10
  },
  scroll100:{
    padding: 0,
    margin:0,
    width: "100%",
    paddingBottom: "20%",
  },

  // reg/log 
  container: {
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    margin:0,
    width: "100%",
    height: "100%",
    paddingBottom: 40
  },
  header:{
    display: "flex",
    flexDirection:"row",
    backgroundColor: '#252124',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingTop: 40,
    width:"100%"
  },
  mainRegLog:{
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#252124',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin:0,
    width: "90%",
    height: "85%",
    borderRadius:10
  },
  form:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap:15,
    margin:0,
    width: "100%",
    height:"90%",
  },
  input:{
    display: "flex",
    flexDirection:"row",
    backgroundColor: '#4F4F4F',
    alignItems: 'center',
    justifyContent: 'start',
    padding: 10,
    width:"100%",
    color:"#fff",
    borderRadius:5,
    fontSize: 20,
  },
  inputPass:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'start',
    width:"90%",
    color:"#fff",
    borderRadius:5,
    fontSize: 20,
  },
  eye:{
    width: 35,
    height: 35
  },
  goToRegLog:{
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  },


  // account

  profileContainer:{
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'start',

    width:"100%",
    height: "100%",
    padding: 0,
    margin:0,
  },
  audioContainer:{
    display: "flex",
    flexDirection:"column",
    backgroundColor: '#3B3B3B',
    alignItems: 'center',
    justifyContent: 'center',

    width:"100%",
    height: "100%",
    padding: 0,
    margin:0,
  },
  profileUp:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    gap: 10,
    padding: 10,
    backgroundColor:"#252124",
    paddingTop: 40

  },
  profileMid:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    gap: 10,
    padding: 10,
    boxSizing: "border-box",
  },
  avatar:{
    width: 120,
    height: 120
  },
  username:{
    width: "100%",
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    textAlign: 'center',
    color: "#E19A38"
  },
  profileDown:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'start',
    justifyContent: 'start',
    width: "100%",
    gap: 10,
    padding: 10,
    boxSizing: "border-box",
    backgroundColor:"#4F4F4F"
  },
  profileSector:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'start',
    justifyContent: 'start',
    width: "100%",
    gap: 10,
    padding: "2%",
    boxSizing: "border-box",
    borderRadius: 10
  },
  profileSectorImage:{
    width: 100,
    height: 100,
    borderRadius: 10,
    border: "3px #252124 solid"
  },
  profileSectorRight:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'start',
    justifyContent: 'start',
    width: "70%",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    boxSizing: "border-box",
    backgroundColor: "#252124"
  },
  socialsDiv:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'start',
    width: "100%",
    gap: 10,
    padding: 0,
    boxSizing: "border-box",
  },
  forExitButton:{
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    width:"100%",
    paddingVertical: 20
  },
  exitButton:{
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    border: "4px solid #fff",
    borderRadius: 10,
    width:"100px"
  },

  // modules

  modulesContainer:{
    backgroundColor: '#252124',
    paddingHorizontal: 15,
    paddingVertical: 40,
    margin:0,
    gap: 15,
    height: "100%",
    width: "100%"
  },
  unlockedModuleButton:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: "2px #E19A38 solid",
    borderRadius: 5,
    backgroundColor:"#3B3B3B",
    width: "100%"
  },
  lockedModuleButton:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: "2px #9DACAC solid",
    borderRadius: 5,
    backgroundColor:"#3B3B3B",
    width: "100%"
  },
  ModuleButtonRight:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  lockImage:{
    width: 22,
    height: 22
  },

  // module

  topicNameDiv:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:"center",
    borderBottomWidth: 3,
    borderBottomColor:"#fff",
    width:"100%"
  },
  topicHomeWork:{
    border: "none"
  },
  topicSection:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'start',
    width:"100%",
    gap: 10
  },
  divForTasks:{
    display: "flex",
    flexDirection:"row",
    alignItems: 'start',
    justifyContent: 'space-between',
    flexWrap:"wrap",
    width:"80%",
  },
  antiIndexMargin:{
    marginTop: -50
  },
  taskButton:{
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'start',
    gap: 10,
    padding: 10,
    maxWidth: 140,
  },
  taskButtonImg:{
    width: 74,
    height: 74,
  },
  taskButtonView:{
    padding: 25,
    display: "flex",
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: 'center',
    border: "4px #E19A38 solid",

    borderRadius: 20
  },
  taskIndex:{
    position:"relative",
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    border: "4px #252124 solid",
    borderRadius: 360,
    backgroundColor:"#E19A38",
    top: 46,
    right: -50,
    zIndex: 2,
    verticalAlign: 'middle',
  },
  uncompletedTask:{
    backgroundColor:"#D1D8DB",
    border:"4px #E19A38 solid"
  },
  completedTask:{
    backgroundColor:"#E19A38",
    border:"4px #252124 solid"
  },
  
  modalWraper:{
    position:"absolute",
    top:0,
    left:0,
    width:"100vw",
    height:"100vh",
    display:"flex",
    direction:"column",
    alignItems:"center", 
    justifyContent:"center",
    backgroundColor:"#25212457",
    zIndex:3
  },
  modal:{
    display:"flex",
    direction:"column",
    alignItems:"center", 
    justifyContent:"center",
    width:"90%",
    backgroundColor:"#3B3B3B",
    borderRadius:10,
    border:"3px #252124 solid"
  },

  // theory
  theorySection:{
    width: "100%", 
    display:"flex", 
    direction:"column",
    alignItems:"start", 
    justifyContent:"start",
    paddingVertical:10,
    gap: 15
  },
  theoryTitle:{
    borderBottomColor:"#fff",
    borderBottomWidth: 2
  },

  // Words

  roleBorder:{
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: 'center'
  },
  roleText:{
    color: "white",
    fontSize: 20,
    textAlign: 'center'
  },
  roleExample:{
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: "space-between",
    flexDirection: 'row'
  },
  buttonAnswer:{
    flex: 1, 
    display:"flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#252124',
    borderWidth: 2,
    borderColor: '#E8F0FE',
    borderRadius: 15,
    minWidth: "40%",
    marginHorizontal: 10,
    marginVertical: 20
  },
  removeButton:{
    // flex: 1, 
    display:"flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 250,
    // height: 200,
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#252124',
    borderWidth: 2,
    borderColor: '#E8F0FE',
    borderRadius: 10,
  },
  viewForAnswers:{
    width: '90%', 
    flex: 1,  
    display: "flex",
    flexDirection:"row",
    alignItems: 'start',
    justifyContent: 'center',
    flexWrap:"wrap",
    maxHeight:"50%"
  }
});
