import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function EditClubInfoScreen({ route, navigation }) {
  const { clubId } = route.params;
  const [club, setClub] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      const token = await AsyncStorage.getItem('userToken');
      try {
        const data = await api.getClubById(clubId, token);
        setClub(data);
        setName(data.name);
        setDescription(data.description);
      } catch (err) {
        console.error('[Management] 동아리 조회 실패', err);
        Alert.alert('오류', '동아리 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, []);

  const saveChanges = async () => {
    const token = await AsyncStorage.getItem('userToken');
    await api.updateClub(clubId, { name, description }, token);
    Alert.alert('완료', '저장되었습니다.', [{ text: '확인', onPress: () => navigation.goBack() }]);
  };

  if (loading) return <SafeAreaView style={styles.loading}><ActivityIndicator /></SafeAreaView>;
  if (!club) return <SafeAreaView style={styles.loading}><Text>동아리 정보를 불러오지 못했습니다.</Text></SafeAreaView>;

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
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginTop: 5 },
  cover: { width: '100%', height: 150, marginVertical: 10 },
});
