import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Button, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function ManagePhotosScreen({ route }) {
  const { clubId } = route.params;
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      const token = await AsyncStorage.getItem('userToken');
      try {
        const data = await api.getClubById(clubId, token);
        setClub(data);
      } catch (err) {
        console.error('[Management] 사진 관리 - 동아리 조회 실패', err);
        Alert.alert('오류', '동아리 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, []);

  const addPhoto = async () => {
    const uri = 'https://via.placeholder.com/150'; // 임시 이미지
    const token = await AsyncStorage.getItem('userToken');
    await api.uploadPhoto(clubId, uri, token);
    const updated = await api.getClubById(clubId, token);
    setClub(updated);
  };

  const deletePhoto = async (photoId) => {
    const token = await AsyncStorage.getItem('userToken');
    await api.deletePhoto(clubId, photoId, token);
    const updated = await api.getClubById(clubId, token);
    setClub(updated);
  };

  if (loading) return <SafeAreaView style={styles.loading}><ActivityIndicator /></SafeAreaView>;
  if (!club) return <SafeAreaView style={styles.loading}><Text>동아리 정보를 불러오지 못했습니다.</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <Button title="사진 추가" onPress={addPhoto} />
      <FlatList
        data={club.photos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.photoItem}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <Button title="삭제" onPress={() => deletePhoto(item.id)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoItem: { marginVertical: 10 },
  photo: { width: '100%', height: 150, borderRadius: 8 },
});
