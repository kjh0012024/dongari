import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function ClubManagementScreen({ navigation }) {
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const clubs = await api.getUserJoinedClubs(token);
      setMyClubs(clubs || []);
      setLoading(false);
    };

    fetchClubs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loading}><ActivityIndicator /></View>
      ) : (
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontSize: 16, fontWeight: 'bold' },
  owner: { fontSize: 12, color: '#f00', marginTop: 5 },
});
