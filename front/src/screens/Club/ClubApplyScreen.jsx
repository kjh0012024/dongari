import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ClubApplyScreen({ route, navigation }) {
  const { club } = route.params;
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const handleApply = () => {
    alert("신청이 완료되었습니다! (추후 백엔드 연동 예정)");
    navigation.goBack();
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
