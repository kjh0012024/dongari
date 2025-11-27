// src/screens/Club/ClubDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ClubDetailScreen({ route }) {
  // 이전 화면(목록)에서 넘겨준 club 정보를 받음
  const { club } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.profile} />
      <Text style={styles.title}>{club?.name || "동아리 이름"}</Text>
      <Text style={styles.sub}>{club?.school} - {club?.category}</Text>
      
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>팔로우 하기</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text>여기에 동아리 소개글이나 활동 사진들이 들어갑니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#fff', paddingTop: 50 },
  profile: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ddd', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold' },
  sub: { color: 'gray', fontSize: 16, marginTop: 5 },
  btn: { marginTop: 20, backgroundColor: 'tomato', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  content: { marginTop: 40, width: '90%', padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10 }
});