import { Video, ResizeMode } from 'expo-av';
import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';



export default function VideoScreen({videoSource}) {
  const video = useRef(null);

  return (

    <View style={styles.contentContainer}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: videoSource,
        }}
        useNativeControls
        isLooping
        resizeMode='stretch'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 320,
    height: 245,
    borderColor: "#e19a38",
    borderWidth: 1
  },
  controlsContainer: {
    width: '100%'
  },
  button:{
    backgroundColor: "#e19a38",
    borderRadius: 10,
    width: 125,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  }
});