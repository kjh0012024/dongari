import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { api } from '../../api';

export default function SchoolListScreen({ navigation }) {
  const [schools, setSchools] = useState([]);
  const [searchText, setSearchText] = useState('');
  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    api.getSchools().then(data => {
      const normalized = (data || []).map(s =>
        typeof s === 'string' ? { id: s, name: s } : { id: s.id, name: s.name }
      );
      setSchools(normalized);
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
        keyExtractor={(item) => item.id?.toString() || item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('SchoolClub', { schoolId: item.id, schoolName: item.name })}
          >
            <Text style={styles.name}>{item.name}</Text>
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
