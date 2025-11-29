import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, SafeAreaView } from 'react-native';
import { mockApi } from '../../api';

export default function EditClubInfoScreen({ route, navigation }) {
  const { clubId } = route.params;
  const userId = '100';
  const [club, setClub] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    mockApi.getClubById(clubId, userId).then(data => {
      setClub(data);
      setName(data.name);
      setDescription(data.description);
    });
  }, []);

  const saveChanges = async () => {
    await mockApi.updateClub(clubId, { name, description });
    alert('저장 완료!');
    navigation.goBack();
  };

  if (!club) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>동아리 이름</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>동아리 소개</Text>
      <TextInput style={[styles.input, { height: 100 }]} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>커버 이미지</Text>
      {club.coverImage && <Image source={{ uri: club.coverImage }} style={styles.cover} />}
      <Button title="커버 이미지 변경" onPress={() => alert('이미지 선택 모의 기능')} />

      <Button title="저장" onPress={saveChanges} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginTop: 5 },
  cover: { width: '100%', height: 150, marginVertical: 10 },
});
