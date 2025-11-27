// src/screens/Feed/FeedScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../api';

export default function FeedScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getFeed().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const handlePressClub = (clubName) => {
    const clubData = {
      name: clubName,
      school: '학교 정보 로딩중...',
      category: '카테고리',
    };

    // ★ 수정된 부분: 복잡한 경로 없이 바로 이름만 부르면 됩니다.
    navigation.navigate('ClubDetail', { club: clubData });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>내 피드</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity onPress={() => handlePressClub(item.club)}>
                <Text style={styles.clubName}>{item.club} &gt;</Text>
              </TouchableOpacity>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.content}>{item.content}</Text>
            <View style={styles.imgPlaceholder} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20 },
  card: { marginBottom: 20, paddingHorizontal: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  clubName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  date: { color: '#888', fontSize: 12 },
  content: { marginBottom: 10, fontSize: 14 },
  imgPlaceholder: { width: '100%', height: 200, backgroundColor: '#eee', borderRadius: 8 }
});