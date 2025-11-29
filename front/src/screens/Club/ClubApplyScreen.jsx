import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function ClubApplyScreen({ route, navigation }) {
  const { club } = route.params;
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const handleApply = async () => {
    if (!name || !reason) {
      Alert.alert('알림', '이름과 지원 동기를 모두 입력해주세요.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await api.applyToClub(club.id, { name, reason }, token);

      if (result.success) {
        Alert.alert('완료', '신청이 접수되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('실패', result.message || '신청 처리 중 문제가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', error.message || '신청 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{club.name} 신청서</Text>

      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력해주세요"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>지원 동기</Text>
      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="지원 동기를 입력해주세요"
        value={reason}
        onChangeText={setReason}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleApply}>
        <Text style={styles.submitText}>신청 제출</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
