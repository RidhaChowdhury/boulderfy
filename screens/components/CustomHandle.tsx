import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomHandle = () => {
  return (
    <View style={styles.handleContainer}>
      <View style={styles.handle} />
    </View>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: '25%',
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Change this to match your dark theme
  },
});

export default CustomHandle;