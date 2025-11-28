import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function ClubManagementScreen({ navigation }) {
  const userId = '100'; // 로그인 후 받아올 userId, 임시로 100
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    mockApi.getUserJoinedClubs(userId).then(setMyClubs);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={myClubs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ClubDetail', { clubId: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            {item.isOwner && <Text style={styles.owner}>동아리장</Text>}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' },
  owner: { fontSize: 12, color: '#f00', marginTop: 5 },
});
