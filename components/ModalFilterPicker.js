import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  Modal,
  View,
  Dimensions,
  TextInput,
} from 'react-native';

const {height, width} = Dimensions.get('window');

export default ({items, onSelect, onCancel, visible, styles}) => {
  const [filter, setFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items.filter(item => item.key.includes(filter)));
  }, [filter, items]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
      onShow={() => {
        setFilter('');
        setFilteredItems(items);
      }}>
      <View
        style={{
          marginLeft: width / 8,
          marginTop: height / 10,
          maxWidth: width * 0.75,
          backgroundColor: '#E6E6E6',
        }}>
        <TextInput
          value={filter}
          onChangeText={text => setFilter(text)}
          placeholder={'Search'}
          style={{borderBottomWidth: 0.5}}
        />
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          {filteredItems.map(item => (
            <TouchableOpacity
              key={item.index}
              onPress={() => {
                onSelect(item.key, item.index);
                onCancel();
              }}>
              <Text style={styles.dropdownItems}>{item.key}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};
