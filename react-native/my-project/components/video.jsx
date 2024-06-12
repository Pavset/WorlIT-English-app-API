import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { PixelRatio, StyleSheet, View, Button, TouchableOpacity, Text, ScrollView } from 'react-native';



export default function VideoScreen({videoSource}) {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    // player.show
    // player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('playingChange', isPlaying => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  // setInterval(async () => {
  //   console.log(await player.currentTime)
  // }, 1000);

  return (

    <View style={styles.contentContainer}>
      <VideoView
        ref={ref}
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls={true}
      />
      {/* <View style={styles.controlsContainer}>
        <TouchableOpacity
          // title={isPlaying ? 'Pause' : 'Play'}
          style={styles.button}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        ><Text style={{fontSize: 20, fontWeight: 'bold'}}>{isPlaying ? 'Pause' : 'Play'}</Text></TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 50,
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