import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Button, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function ManagePhotosScreen({ route }) {
  const { clubId } = route.params;
  const [club, setClub] = useState(null);

  useEffect(() => {
    mockApi.getClubById(clubId, '100').then(setClub);
  }, []);

  const addPhoto = async () => {
    const uri = 'https://via.placeholder.com/150'; // 임시 이미지
    await mockApi.uploadPhoto(clubId, uri);
    const updated = await mockApi.getClubById(clubId, '100');
    setClub(updated);
  };

  const deletePhoto = async (photoId) => {
    await mockApi.deletePhoto(clubId, photoId);
    const updated = await mockApi.getClubById(clubId, '100');
    setClub(updated);
  };

  if (!club) return <Text>Loading...</Text>;

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
  photoItem: { marginVertical: 10 },
  photo: { width: '100%', height: 150, borderRadius: 8 },
});
