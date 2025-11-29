import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function ClubDetailManagementScreen({ route }) {
  const { clubId } = route.params;
  const [club, setClub] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      try {
        const [clubData, applicantList] = await Promise.all([
          api.getClubById(clubId, token),
          api.getApplicants(clubId, token),
        ]);
        setClub(clubData);
        setApplicants(applicantList || []);
      } catch (err) {
        console.error('[Management] 동아리/신청자 조회 실패', err);
        Alert.alert('오류', '동아리 정보를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const acceptApplicant = async (applicantId) => {
    const token = await AsyncStorage.getItem('userToken');
    const result = await api.acceptApplicant(clubId, applicantId, token);
    if (result) {
      setApplicants(prev => prev.map(a => a.id === applicantId ? result : a));
      api.sendNotification(result.id, `${club.name} 동아리에 합격했습니다!`, token).catch(() => {});
    }
  };

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;
  if (!club) return <SafeAreaView style={styles.center}><Text>동아리 정보를 불러오지 못했습니다.</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{club.name}</Text>
      <Text>{club.description}</Text>
      {club.coverImage && <Image source={{ uri: club.coverImage }} style={styles.cover} />}
      
      <Text style={styles.sectionTitle}>신청자 목록</Text>
      <FlatList
        data={applicants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.applicantItem}>
            <Text>{item.name} ({item.studentId})</Text>
            <Text>지원동기: {item.motive}</Text>
            {item.status !== 'accepted' && (
              <Button title="합격" onPress={() => acceptApplicant(item.id)} />
            )}
            {item.status === 'accepted' && <Text style={styles.accepted}>합격</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  cover: { width: '100%', height: 200, marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  applicantItem: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  accepted: { color: 'green', fontWeight: 'bold', marginTop: 5 },
});
