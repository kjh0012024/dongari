// src/screens/Feed/FeedScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { mockApi } from '../../api';

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getFeed().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

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
              <Text style={styles.clubName}>{item.club}</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  clubName: { fontWeight: 'bold', fontSize: 16 },
  date: { color: '#888', fontSize: 12 },
  content: { marginBottom: 10, fontSize: 14 },
  imgPlaceholder: { width: '100%', height: 200, backgroundColor: '#eee', borderRadius: 8 }
});