import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Modal, Button, ButtonGroup, Input, Select, SelectItem, IndexPath, Text } from '@ui-kitten/components';
import { boulderGrades, topRopeGrades, holdColors, routeTags, tagColors, gradeColors } from '../constants';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

type AddRouteModalProps = {
  visible: boolean,
  onClose: () => void,
  onAddRoute: (name: string, grade: string, color: string, tags: string[]) => void,
  route?: { name: string, grade: string, color: string, tags: string[] },
  isTopRope: boolean,
  setIsTopRope: React.Dispatch<React.SetStateAction<boolean>>,
};

export const AddRouteModal = ({
  visible,
  onClose,
  onAddRoute,
  route,
  isTopRope,
  setIsTopRope,
}: AddRouteModalProps): React.ReactElement => {
  const [routeName, setRouteName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedTags, setSelectedTags] = useState<IndexPath[]>([]);
  const contentRef = useRef<View>(null);

  useEffect(() => {
    if (route) {
      setRouteName(route.name);
      const gradeList = isTopRope ? topRopeGrades : boulderGrades;
      const gradeIndex = gradeList.findIndex(g => g === route.grade);
      setSelectedIndex(new IndexPath(gradeIndex));
      setSelectedColor(route.color || '#FFFFFF');
      setSelectedTags(route.tags.map(tag => new IndexPath(routeTags.indexOf(tag))));
    } else {
      setRouteName('');
      setSelectedIndex(new IndexPath(0));
      setSelectedColor('#FFFFFF');
      setSelectedTags([]);
    }
  }, [route, isTopRope]);

  useEffect(() => {
    if (!route) {
      setSelectedIndex(new IndexPath(0));
    }
  }, [isTopRope]);

  const generateRandomName = () => {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: ' ',
      style: 'capital',
      length: 2,
    });
  };

  const handleAddRoute = () => {
    const gradeList = isTopRope ? topRopeGrades : boulderGrades;
    const grade = gradeList[selectedIndex.row];
    const name = routeName.trim() !== '' ? routeName : generateRandomName();
    const tags = selectedTags.map(indexPath => routeTags[indexPath.row]);
    onAddRoute(name, grade, selectedColor, tags);
    setRouteName('');
    setSelectedIndex(new IndexPath(0));
    setSelectedColor('#FFFFFF');
    setSelectedTags([]);
    onClose();
  };

  const gradeList = isTopRope ? topRopeGrades : boulderGrades;

  return (
    <Modal visible={visible} onBackdropPress={onClose} style={styles.modalContainer}>
      <View ref={contentRef}>
        <Text category='h4'>{route ? 'Edit Route' : 'Add Route'}</Text>
        <View style={styles.fieldsContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.toggleContainer}>
              <Text category='label' style={styles.colorLabel}>Route Style</Text>
              <ButtonGroup style={styles.buttonGroup} size='small'>
                <Button
                  style={[styles.button, isTopRope ? styles.buttonSelected : styles.buttonUnselected]}
                  onPress={() => setIsTopRope(true)}
                >
                  Top Rope
                </Button>
                <Button
                  style={[styles.button, !isTopRope ? styles.buttonSelected : styles.buttonUnselected]}
                  onPress={() => setIsTopRope(false)}
                >
                  Boulder
                </Button>
              </ButtonGroup>
            </View>
            <Input
              label="Route Name"
              placeholder="Enter route name"
              value={routeName}
              onChangeText={setRouteName}
              style={styles.routeNameInput}
            />
          </View>
          <View style={styles.gradeAndTagsContainer}>
            <Select
              label="Grade"
              placeholder="Select grade"
              value={gradeList[selectedIndex.row]}
              selectedIndex={selectedIndex}
              onSelect={index => setSelectedIndex(index as IndexPath)}
              style={styles.gradeSelect}
            >
              {gradeList.map((grade, index) => (
                <SelectItem
                  key={index}
                  title={grade}
                  style={[styles.selectItem, { backgroundColor: gradeColors[grade] }]}
                />
              ))}
            </Select>
            <Select
              multiSelect
              value={selectedTags.map(indexPath => routeTags[indexPath.row]).join(', ')}
              selectedIndex={selectedTags}
              onSelect={index => setSelectedTags(index as IndexPath[])}
              style={styles.multiSelect}
              label={'Tags'}
            >
              {routeTags.map((tag, index) => (
                <SelectItem
                  key={index}
                  title={tag}
                  style={[styles.selectItem, { backgroundColor: tagColors[tag] }]}
                />
              ))}
            </Select>
          </View>
          <View>
            <Text style={styles.colorLabel}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPickerContainer}>
              <View style={styles.colorPicker}>
                {holdColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorSwatch, 
                      { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0, borderColor: 'white' }
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handleAddRoute}>{route ? 'UPDATE' : 'ADD'}</Button>
          <Button appearance='ghost' status='basic' onPress={onClose}>Cancel</Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#2b3554',
    maxWidth: '90%', // Limit modal width
  },
  fieldsContainer: {
    marginVertical: 16,
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  routeNameInput: {
    flex: 2,
    width: '100%',
  },
  gradeSelect: {
    width: 100,
  },
  selectItem: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  toggleContainer: {
    width: '100%',
  },
  toggleLabel: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
  },
  buttonSelected: {
    backgroundColor: '#3366FF',
    borderColor: '#3366FF',
  },
  buttonUnselected: {
    backgroundColor: '#2b3554',
    borderColor: '#2b3554',
  },
  gradeAndTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8F9BB3',
    marginBottom: 8,
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    overflow: 'hidden', // Prevent overflow outside the container
  },
  colorPicker: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  multiSelect: {
    flex: 2,
  },
});

export default AddRouteModal;
