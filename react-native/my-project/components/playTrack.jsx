import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import { Slider, NativeBaseProvider, HStack } from 'native-base'
let started = false

export default function AudioBar({url}) {
  const [sound, setSound] = useState();
  const [position, setPosition] = useState(0)
  const [isPlay, setPlay] = useState(true)
  const [progress, setProgress] = useState(0)
  
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    setSound(sound);
    started = true
    await sound.playAsync();
  }

  async function stopSound(){
      setPosition(0)
      await sound.stopAsync()
  }
  async function rewindForward(){
    let status = await sound.getStatusAsync();
    await sound.playFromPositionAsync(status.positionMillis+15000)
  }
  
  async function rewindBack(){
    let status = await sound.getStatusAsync();

    let newPos = status.positionMillis-15000
    if(newPos < 0){
      newPos = 0
    }
    setPosition(newPos)
    await sound.playFromPositionAsync(status.positionMillis-15000)

  }

  async function pauseSound(){


    if (isPlay){
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis);

        await sound.pauseAsync()
    }
    else{
        await sound.playFromPositionAsync(position)
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis);

    }
    setPlay(!isPlay);
  }

   useEffect(() => {
    var timer = setInterval(async () => {
      if (sound){
        const status = await sound.getStatusAsync();
        
        if (status){
         var percent = status.durationMillis/100
         var percentNow = Math.floor(status.positionMillis/percent)
         setProgress(percentNow)
        } 
      }
    }, 1000);

    return sound
      ? () => {
          sound.unloadAsync();
          clearInterval(timer)
        }
      : undefined;
  }, [sound]);

  return (
    <NativeBaseProvider>
      <View style={styles.container}>

      <HStack space={4} justifyContent="center">
        <TouchableOpacity onPress={rewindBack}>
          <Image source = {require=("../assets/15back.png")} style = {styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={rewindForward} >
          <Image source = {require=("../assets/15forward.png")} style = {styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={stopSound} >
          <Image source = {require=("../assets/toBeggining.png")} style = {styles.image} />
        </TouchableOpacity>

        <TouchableOpacity onPress={!started ? playSound : pauseSound} >
          <Image source = { isPlay ? require=("../assets/pause.png"):require=("../assets/unpause.png")} style = {styles.image} />
        </TouchableOpacity>

      </HStack>

        <Slider value={progress} minValue={0} maxValue={100} defaultValue={0}  step = {0} colorScheme="cyan">
          <Slider.Track>
            <Slider.FilledTrack bg = "warning.500"/>
          </Slider.Track>
     
        </Slider>
        
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50
  }
});
