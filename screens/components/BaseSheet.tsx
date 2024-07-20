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
  const [contentHeight, setContentHeight] = useState(0);

  const updateSnapPoints = useCallback((height: number) => {
    const screenHeight = Dimensions.get('window').height;
    const minHeightPercentage = (Math.max(height + 50, screenHeight * 0.3) / screenHeight) * 100;
    const newSnapPoints = [`${minHeightPercentage}%`];
    setSnapPoints(newSnapPoints);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        contentRef.current?.measure((x: number, y: number, width: number, height: number) => {
          if (height > 0) {
            setContentHeight(height);
            updateSnapPoints(height);
          }
        });
      }, 100);
    }
  }, [contentRef, updateSnapPoints]);

  useEffect(() => {
    if (visible && activeSheet === sheetName) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, sheetName, setActiveSheet, activeSheet]);

  const handleSheetChanges = useCallback((index: number) => {
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
      handleComponent={() => <CustomHandle onClose={onClose} />}
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
