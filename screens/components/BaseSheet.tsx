import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomHandle from './CustomHandle';
import { useSheet } from '../../context/SheetContext';

type BaseSheetProps = {
  visible: boolean;
  onClose: () => void;
  sheetName: string;
  snapPoints?: string[];
  children: React.ReactNode;
};

const BaseSheet: React.FC<BaseSheetProps> = ({
  visible,
  onClose,
  sheetName,
  snapPoints = ['50%'],
  children,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { activeSheet, setActiveSheet } = useSheet();

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
      setActiveSheet(sheetName);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (activeSheet !== sheetName) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.expand();
    }
  }, [activeSheet]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleComponent={CustomHandle}
      backgroundStyle={{ backgroundColor: '#2b3554' }}
      onClose={() => {
        onClose();
        if (activeSheet === sheetName) {
          setActiveSheet(null);
        }
      }}
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
  },
});

export default BaseSheet;
