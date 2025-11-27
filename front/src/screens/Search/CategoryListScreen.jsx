import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function CategoryListScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    mockApi.getClubs('카테고리별').then(data => {
      const uniqueCategories = [...new Set(data.map(c => c.category))]; // 카테고리 이름만 추출
      setCategories(uniqueCategories);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={categories}
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
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' }
});
