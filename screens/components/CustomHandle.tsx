import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, IconElement, IconProps } from '@ui-kitten/components';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';

interface CustomHandleProps {
  onClose: () => void;
}

const CustomHandle: React.FC<CustomHandleProps> = ({ onClose }) => {
  const CloseIcon = (props: IconProps): IconElement => <Icon {...props} name='close' style={[props.style, { transform: [{ scaleY: -1 }] }]} />;

  return (
    <View style={styles.handleContainer}>
      <View style={styles.handle} />
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <CloseIcon fill='#FFFFFF' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  handle: {
    width: '25%',
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Change this to match your dark theme
  },
  closeButton: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Change this to match your dark theme
    position: 'absolute',
    right: 5,
    // marginTop: 5,
  },
});

export default CustomHandle;
