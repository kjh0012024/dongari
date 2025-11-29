import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function ApplicantsScreen({ route }) {
  const { clubId } = route.params;
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    mockApi.getApplicants(clubId).then(setApplicants);
  }, []);

  const accept = async (applicantId) => {
    const result = await mockApi.acceptApplicant(clubId, applicantId);
    if (result) {
      mockApi.sendNotificationMock(result.id, '합격 알림!');
      setApplicants(prev => prev.map(a => a.id === applicantId ? result : a));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: 'bold' },
  accepted: { color: 'green', fontWeight: 'bold', marginTop: 5 },
});
