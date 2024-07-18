import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Select, SelectItem, IndexPath, Text, Layout } from '@ui-kitten/components';
import BottomSheet from '@gorhom/bottom-sheet';
import { grades, colorSwatches } from '../constants';  // Assuming colorSwatches is defined in your constants
import CustomHandle from './CustomHandle';

type AddRouteModalProps = {
  visible: boolean,
  onClose: () => void,
  onAddRoute: (name: string, grade: string, color: string) => void,
  route?: { name: string, grade: string, color: string },
};


export const AddRouteModal = ({
  visible,
  onClose,
  onAddRoute,
  route
}: AddRouteModalProps): React.ReactElement => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [routeName, setRouteName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Default color

  useEffect(() => {
    if (route) {
      setRouteName(route.name);
      const gradeIndex = grades.findIndex(g => g === route.grade);
      setSelectedIndex(new IndexPath(gradeIndex));
      setSelectedColor(route.color || '#FFFFFF');
    } else {
      setRouteName('');
      setSelectedIndex(new IndexPath(0));
      setSelectedColor('#FFFFFF');
    }
  }, [route]);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleAddRoute = () => {
    const grade = grades[selectedIndex.row];
    const name = routeName.trim() !== '' ? routeName : 'Unnamed Route';
    onAddRoute(name, grade, selectedColor);
    setRouteName('');
    setSelectedIndex(new IndexPath(0));
    setSelectedColor('#FFFFFF');
    onClose();
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['25%', '50%']}
      enablePanDownToClose={true}
      handleComponent={CustomHandle}
      backgroundStyle={{ backgroundColor: '#2b3554' }}
    >
      <View style={styles.contentContainer}>
        <Text category='h6'>{route ? 'Edit Route' : 'Add Route'}</Text>
        <View style={styles.fieldsContainer}>
          <Input
            label="Route Name"
            placeholder="Enter route name"
            value={routeName}
            onChangeText={setRouteName}
            style={styles.routeNameInput}
          />
          <Select
            label="Grade"
            placeholder="Select grade"
            value={grades[selectedIndex.row]}
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index as IndexPath)}
            style={styles.gradeSelect}
          >
            {grades.map((grade, index) => (
              <SelectItem key={index} title={grade} />
            ))}
          </Select>
        </View>
        <View style={styles.colorPicker}>
          {colorSwatches.map((color, index) => (
            <Button
              key={index}
              style={[
                styles.colorSwatch, 
                { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0, borderColor: 'white' }
              ]}
              onPress={() => handleColorSelect(color)}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handleAddRoute}>{route ? 'UPDATE' : 'ADD'}</Button>
          <Button onPress={onClose} appearance="ghost">CANCEL</Button>
        </View>
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
  fieldsContainer: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  routeNameInput: {
    flex: 1,
  },
  gradeSelect: {
    width: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 0, // Remove border to look more like swatches
  },
});
