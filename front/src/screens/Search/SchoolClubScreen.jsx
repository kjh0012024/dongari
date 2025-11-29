import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { api } from '../../api';

export default function SchoolClubScreen({ route, navigation }) {
  const { schoolId, schoolName } = route.params;
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    api.getClubs({ schoolId }).then(data => {
      setClubs(data);
      setFilteredClubs(data);
    });
  }, [schoolId]);

  useEffect(() => {
    const filtered = clubs.filter(club =>
      club.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredClubs(filtered);
  }, [searchText, clubs]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TextInput
        style={styles.searchInput}
        placeholder={`${schoolName || '학교'} 동아리 검색...`}
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredClubs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ClubDetail', { club: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>{item.schoolName} | {item.category}</Text>
            {item.description ? (
              <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
            ) : null}
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
  name: { fontSize: 16, fontWeight: 'bold' },
  info: { color: 'gray', marginTop: 5 },
  description: { color: '#555', marginTop: 6 }
});
