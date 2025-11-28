// src/screens/Management/ClubManagementScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ClubManagementScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>동아리 관리</Text>
        <Text style={styles.subText}>내가 운영진인 동아리 목록이 여기에 뜹니다.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subText: { color: 'gray' },
});