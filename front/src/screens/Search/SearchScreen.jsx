import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>동아리 찾기</Text>
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('SchoolList')}
        >
          <Ionicons name="school-outline" size={40} color="#333" />
          <Text style={styles.cardText}>학교별</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('CategoryList')}
        >
          <Ionicons name="grid-outline" size={40} color="#333" />
          <Text style={styles.cardText}>카테고리별</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
  card: { width: '48%', height: 150, backgroundColor: '#f0f0f0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: '600' }
});
