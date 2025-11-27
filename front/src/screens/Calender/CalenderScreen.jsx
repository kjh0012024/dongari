// src/screens/Calender/CalenderScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function CalenderScreen() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    mockApi.getCalendar().then(setSchedules);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>활동 일정</Text>
      <FlatList
        data={schedules}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20 },
  card: { marginHorizontal: 20, marginBottom: 15, padding: 15, backgroundColor: '#f8f9fa', borderLeftWidth: 5, borderColor: 'tomato', borderRadius: 5 },
  date: { color: 'tomato', fontWeight: 'bold', marginBottom: 5 },
  title: { fontSize: 16 }
});