import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockApi } from '../../api';

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);

  useEffect(() => {
    // 모든 동아리 목록 불러오기 (학교별 + 카테고리별 합치기)
    Promise.all([mockApi.getClubs('학교별'), mockApi.getClubs('카테고리별')])
      .then(([schoolClubs, categoryClubs]) => {
        const merged = [...schoolClubs, ...categoryClubs];
        setAllClubs(merged);
        setFilteredClubs(merged);
      });
  }, []);

  useEffect(() => {
    // 검색어에 따라 필터링
    const filtered = allClubs.filter(club =>
      club.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredClubs(filtered);
  }, [searchText, allClubs]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>동아리 찾기</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="동아리 이름으로 검색..."
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
            <Text style={styles.info}>{item.school} | {item.category}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('SchoolFilter')}
        >
          <Ionicons name="school-outline" size={40} color="#333" />
          <Text style={styles.cardText}>학교별</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('CategoryFilter')}
        >
          <Ionicons name="grid-outline" size={40} color="#333" />
          <Text style={styles.cardText}>카테고리별</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchInput: { height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  card: { width: '48%', height: 120, backgroundColor: '#f0f0f0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: '600' },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' },
  info: { color: 'gray', marginTop: 5 }
});
