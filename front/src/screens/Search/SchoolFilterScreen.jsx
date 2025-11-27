// src/screens/Search/SchoolFilterScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function SchoolFilterScreen({ navigation }) {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    mockApi.getClubs('school').then(setClubs);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={clubs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => navigation.navigate('ClubDetail', { club: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>{item.school} | {item.category}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  item: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' },
  info: { color: 'gray', marginTop: 5 }
});