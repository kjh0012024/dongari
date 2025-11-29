import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { mockApi } from '../../api';

export default function CategoryListScreen({ navigation }) {
  const [categories, setCategories] = useState([]); // 전체 카테고리
  const [searchText, setSearchText] = useState(''); // 검색어

  useEffect(() => {
    mockApi.getClubs().then(data => {
      const categoryList = data.flatMap(club =>
        club.category
          ? club.category.split(',').map(name => name.trim()).filter(Boolean)
          : []
      );

      const uniqueCategories = [...new Set(categoryList)].sort((a, b) =>
        a.localeCompare(b)
      );

      setCategories(uniqueCategories);
    });
  }, []);

  // 검색 필터링된 카테고리 목록
  const filtered = categories.filter(cat =>
    cat.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TextInput
        style={styles.searchInput}
        placeholder="카테고리 검색..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('CategoryClub', { category: item })}
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
