import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, ViewStyle } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomHandle from './CustomHandle';
import { useSheet } from '../../context/SheetContext';

interface BaseSheetProps {
  visible: boolean;
  onClose: () => void;
  sheetName: string;
  children: React.ReactNode;
  contentRef: React.RefObject<View>;
}

const BaseSheet: React.FC<BaseSheetProps> = ({
  visible,
  onClose,
  sheetName,
  children,
  contentRef,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { activeSheet, setActiveSheet } = useSheet();
  const [snapPoints, setSnapPoints] = useState<(string | number)[]>(['50%', '90%']);

  const updateSnapPoints = useCallback((height: number) => {
    const screenHeight = Dimensions.get('window').height;
    const minHeightPercentage = (Math.max(height+50, screenHeight * 0.3) / screenHeight) * 100;
    const newSnapPoints = [`${minHeightPercentage}%`];
    console.log('Setting new snap points:', newSnapPoints);
    setSnapPoints(newSnapPoints);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        contentRef.current?.measure((x: number, y: number, width: number, height: number) => {
          console.log('Measured height:', height);
          if (height > 0) {
            updateSnapPoints(height);
          }
        });
      }, 100);
    }
  }, [contentRef, updateSnapPoints]);

  useEffect(() => {
    if (visible) {
      console.log('Expanding sheet');
      bottomSheetRef.current?.expand();
      setActiveSheet(sheetName);
    } else {
      console.log('Closing sheet');
      bottomSheetRef.current?.close();
    }
  }, [visible, sheetName, setActiveSheet]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Sheet index changed:', index);
    if (index === -1) {
      onClose();
      if (activeSheet === sheetName) {
        setActiveSheet(null);
      }
    }
  }, [onClose, activeSheet, sheetName, setActiveSheet]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      handleComponent={CustomHandle}
      backgroundStyle={{ backgroundColor: '#2b3554' }}
    >
      <View style={styles.contentContainer}>
        {children}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2b3554',
  } as ViewStyle,
});

export default BaseSheet;
