import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function ClubDetailManagementScreen({ route }) {
  const { clubId } = route.params;
  const userId = '100'; // 로그인 후 받아올 userId
  const [club, setClub] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    mockApi.getClubById(clubId, userId).then(setClub);
    mockApi.getApplicants(clubId).then(setApplicants);
  }, []);

  const acceptApplicant = async (applicantId) => {
    const result = await mockApi.acceptApplicant(clubId, applicantId);
    if (result) {
      setApplicants(prev => prev.map(a => a.id === applicantId ? result : a));
      mockApi.sendNotificationMock(result.id, `${club.name} 동아리에 합격했습니다!`);
    }
  };

  if (!club) return <Text>Loading...</Text>;

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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  cover: { width: '100%', height: 200, marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  applicantItem: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  accepted: { color: 'green', fontWeight: 'bold', marginTop: 5 },
});
