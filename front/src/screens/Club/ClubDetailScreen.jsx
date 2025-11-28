import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, TextInput,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ClubDetailScreen({ route, navigation }) {
  const { club, isAdmin = false } = route.params;

  // 팔로우 및 소개글 상태
  const [followers, setFollowers] = useState(club.followers || 0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [intro, setIntro] = useState(club.intro || "아직 소개글이 없습니다.");
  const [editIntroVisible, setEditIntroVisible] = useState(false);

  // 사진 업로드 (임시)
  const [images, setImages] = useState(club.images || []);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(prev => (isFollowing ? prev - 1 : prev + 1));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔥 커버 이미지 */}
      <Image
        source={{ uri: club.cover }}
        style={styles.coverImage}
      />

      {/* 동아리명 */}
      <View style={styles.titleBlock}>
        <Text style={styles.clubName}>{club.name}</Text>
      </View>

      {/* 팔로우 / 신청 */}
      <View style={styles.followContainer}>
        <Text style={styles.followCount}>팔로워 {followers}명</Text>

        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={handleFollow}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? "팔로잉" : "팔로우"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => navigation.navigate("ClubApply", { club })}
        >
          <Text style={styles.joinButtonText}>동아리 신청</Text>
        </TouchableOpacity>
      </View>

      {/* 소개글 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>동아리 소개</Text>
        <Text style={styles.introText}>{intro}</Text>

        {isAdmin && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditIntroVisible(true)}
          >
            <Text style={styles.editButtonText}>소개글 수정</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 사진 업로드 - 관리자만 */}
      {isAdmin && (
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>사진 업로드</Text>
        </TouchableOpacity>
      )}

      {/* 활동 사진 그리드 */}
      <Text style={styles.sectionTitle}>활동 사진</Text>

      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.imageItem} />
        )}
        scrollEnabled={false}
      />

      {/* 소개글 수정 모달 */}
      <Modal visible={editIntroVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>소개글 수정</Text>

            <TextInput
              style={styles.modalInput}
              value={intro}
              onChangeText={setIntro}
              multiline
            />

            <TouchableOpacity
              style={styles.modalSave}
              onPress={() => setEditIntroVisible(false)}
            >
              <Text style={styles.modalSaveText}>저장</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setEditIntroVisible(false)}
            >
              <Text style={styles.modalCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* 커버 이미지 */
  coverImage: {
    width: "100%",
    height: 200,
  },

  titleBlock: {
    padding: 20,
    paddingBottom: 10,
  },
  clubName: {
    fontSize: 28,
    fontWeight: "bold",
  },

  followContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  followCount: {
    fontSize: 16,
    marginRight: 12,
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#3498db",
    borderRadius: 20,
    marginRight: 10,
  },
  followingButton: {
    backgroundColor: "#aaa",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2ecc71",
    borderRadius: 20,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    lineHeight: 22,
  },

  editButton: {
    marginTop: 10,
    backgroundColor: "#e67e22",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  uploadButton: {
    backgroundColor: "#9b59b6",
    padding: 12,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  /* 사진 그리드 */
  imageItem: {
    width: "33%",
    height: 120,
  },

  /* 모달 */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    height: 120,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  modalSave: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalSaveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalCancel: {
    padding: 10,
  },
  modalCancelText: {
    textAlign: "center",
    color: "#555",
  },
});
