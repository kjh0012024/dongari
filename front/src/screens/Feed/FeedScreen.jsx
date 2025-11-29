// src/screens/Feed/FeedScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { mockApi } from '../../api';

export default function FeedScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeed = async () => {
      try {
        const data = await mockApi.getFeed();
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('[Feed] 피드를 불러오는 중 오류', err);
        if (isMounted) {
          setError('피드를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeed();

    return () => {
      isMounted = false;
    };
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

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date) ? String(value) : date.toISOString().slice(0, 10);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>내 피드</Text>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      <FlatList
        data={posts}
        keyExtractor={item => item.id || item.POST_ID || `${item.clubId || item.CLUB_ID}-${item.createdAt || item.date}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity onPress={() => handlePressClub(item.club || item.clubName)}>
                <Text style={styles.clubName}>{item.club || item.clubName || '알 수 없는 동아리'} &gt;</Text>
              </TouchableOpacity>
              <Text style={styles.date}>{formatDate(item.date || item.createdAt)}</Text>
            </View>
            {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
            <Text style={styles.content}>{item.content}</Text>
            <View style={styles.imgPlaceholder} />
          </View>
        )}
        ListEmptyComponent={!error ? (
          <View style={styles.center}> 
            <Text style={styles.emptyText}>등록된 게시글이 없습니다.</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20 },
  errorText: { color: 'red', paddingHorizontal: 20, marginBottom: 10 },
  card: { marginBottom: 20, paddingHorizontal: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  clubName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  date: { color: '#888', fontSize: 12 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  content: { marginBottom: 10, fontSize: 14 },
  imgPlaceholder: { width: '100%', height: 200, backgroundColor: '#eee', borderRadius: 8 },
  emptyText: { color: '#666', fontSize: 14 },
});