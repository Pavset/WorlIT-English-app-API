import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

export default function FullWidthImage(imageUrl){
  if(!imageUrl){
    imageUrl = 'https://example.com/your-image.jpg'; // Замените на URL вашего изображения
  }
  // console.log(imageUrl)
  // console.log(`${imageUrl.imageUrl}imba-----${Image.getSize(imageUrl.imageUrl)}`)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  Image.getSize(imageUrl.imageUrl, (width, height) => {setImageDimensions({width, height})});
  
  const aspectRatio = imageDimensions.width / imageDimensions.height;
  // console.log(imageDimensions)
  return (
    <View style={styles.container}>
      <Image
        source={imageUrl.imageUrl}
        style={[styles.image, { aspectRatio }]}
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
    width: "90vw", // Ваша желаемая ширина
  },
});