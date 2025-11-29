import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function ApplicantsScreen({ route }) {
  const { clubId } = route.params;
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = await AsyncStorage.getItem('userToken');
      try {
        const data = await api.getApplicants(clubId, token);
        setApplicants(data || []);
      } catch (err) {
        console.error('[Management] 신청자 조회 실패', err);
        Alert.alert('오류', '신청자 목록을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const accept = async (applicantId) => {
    const token = await AsyncStorage.getItem('userToken');
    const result = await api.acceptApplicant(clubId, applicantId, token);
    if (result) {
      api.sendNotification(result.id, '합격 알림!', token).catch(() => {});
      setApplicants(prev => prev.map(a => a.id === applicantId ? result : a));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loading}><ActivityIndicator /></View>
      ) : (
        <FlatList
          data={applicants}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.name} ({item.studentId})</Text>
              <Text>지원동기: {item.motive}</Text>
              {item.status !== 'accepted' ? (
                <Button title="합격" onPress={() => accept(item.id)} />
              ) : (
                <Text style={styles.accepted}>합격</Text>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: 'bold' },
  accepted: { color: 'green', fontWeight: 'bold', marginTop: 5 },
});
