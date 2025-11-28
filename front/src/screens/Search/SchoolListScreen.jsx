import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { mockApi } from '../../api';

export default function SchoolListScreen({ navigation }) {
  const [schools, setSchools] = useState([]);
  const [searchText, setSearchText] = useState('');
  const filteredSchools = schools.filter(s => s.toLowerCase().includes(searchText.toLowerCase()) );

  useEffect(() => {
    mockApi.getClubs('학교별').then(data => {
      const uniqueSchools = [...new Set(data.map(c => c.school))]; // 학교 이름만 추출
      setSchools(uniqueSchools);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
         <TextInput
                style={styles.searchInput}
                placeholder={`학교 검색...`}
                value={searchText}
                onChangeText={setSearchText}
              />
      <FlatList
        data={filteredSchools}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('SchoolClub', { school: item })}
          >
            <Text style={styles.name}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', padding: 20 },
    searchInput: { height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 10 },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' }
});
