import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function FullWidthImage(imageUrl){
  if(!imageUrl){
    imageUrl = 'https://example.com/your-image.jpg';
  }
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  Image.getSize(imageUrl.imageUrl, (width, height) => {setImageDimensions({width, height})});
  if (imageDimensions.height > 0){
    var aspectRatio = imageDimensions.width / imageDimensions.height;
  }
  
  return (
    <View style={styles.container}>
      <Image
        source={imageUrl.imageUrl}
        style={[styles.image, { aspectRatio: aspectRatio }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "90vw",
  },
});