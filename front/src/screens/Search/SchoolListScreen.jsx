import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function SchoolListScreen({ navigation }) {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    mockApi.getClubs('학교별').then(data => {
      const uniqueSchools = [...new Set(data.map(c => c.school))]; // 학교 이름만 추출
      setSchools(uniqueSchools);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={schools}
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
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' }
});
