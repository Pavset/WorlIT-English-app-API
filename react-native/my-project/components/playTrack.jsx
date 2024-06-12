import { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

let started = false

export default function AudioBar({url}) {
  const [sound, setSound] = useState();
  const [position, setPosition] = useState(0)
  const [isPlay, setPlay] = useState(true)


  async function playSound() {
    console.log('Loading Sound');
    
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    setSound(sound);
    let status = await sound.getStatusAsync();
    setPosition(status.positionMillis)

    console.log('Playing Sound');
    started = true
    await sound.playAsync();
    console.log(position)
  }

  async function stopSound(){
      setPosition(0)
      await sound.stopAsync()
  }
  async function rewindForward(){
    let status = await sound.getStatusAsync();

    await sound.playFromPositionAsync(status.positionMillis+15000)
    console.log(status.positionMillis)
  }
  
  async function rewindBack(){
    let status = await sound.getStatusAsync();

    let newPos = status.positionMillis-15000
    if(newPos < 0){
      newPos = 0
    }
    setPosition(newPos)
    await sound.playFromPositionAsync(status.positionMillis-15000)
    console.log(status.positionMillis)
  }

  async function pauseSound(){

    console.log(isPlay)
    if (isPlay){
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis);
        console.log(position)
        await sound.pauseAsync()
    }
    else{
        await sound.playFromPositionAsync(position)
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis);
        console.log(position)
    }
    setPlay(!isPlay);
  }


  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
// stopAsync()
  return (
    <View style={styles.container}>
      <Button title="To Beggining" onPress={stopSound} />
      <Button title={isPlay ? "Pause":"Unpause"} onPress={!started ? playSound : pauseSound} />
      <Button title="+15s" onPress={rewindForward} />
      <Button title="-15s" onPress={rewindBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
