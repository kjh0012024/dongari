// src/screens/Calender/CalenderScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars'; // 라이브러리 import
import { mockApi } from '../../api';

// [설정] 달력을 한국어로 나오게 설정
LocaleConfig.locales['kr'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';

export default function CalenderScreen() {
  const [schedules, setSchedules] = useState([]);      // 전체 일정 데이터
  const [markedDates, setMarkedDates] = useState({});  // 달력에 점 찍을 데이터
  const [selectedDate, setSelectedDate] = useState(''); // 사용자가 누른 날짜
  const [filteredSchedules, setFilteredSchedules] = useState([]); // 선택된 날짜의 일정들

  // 1. 데이터 가져오기
  useEffect(() => {
    mockApi.getCalendar().then(data => {
      setSchedules(data);
      
      // 달력에 보여줄 '점(dot)' 데이터 가공하기
      const marks = {};
      data.forEach(item => {
        // item.date (예: '2025-12-01')에 점 찍기 설정
        marks[item.date] = { 
          marked: true, 
          dotColor: 'tomato' 
        };
      });
      setMarkedDates(marks);
    });
  }, []);

  // 2. 날짜를 눌렀을 때 실행되는 함수
  const handleDayPress = (day) => {
    const dateString = day.dateString; // 누른 날짜 (YYYY-MM-DD)
    setSelectedDate(dateString);

    // 전체 일정 중, 누른 날짜와 같은 일정만 필터링
    const filtered = schedules.filter(item => item.date === dateString);
    setFilteredSchedules(filtered);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headerTitle}>활동 캘린더</Text>

      {/* 달력 컴포넌트 */}
      <Calendar
        // 기본 스타일 설정
        theme={{
          selectedDayBackgroundColor: 'tomato', // 선택된 날짜 배경색
          todayTextColor: 'tomato',             // 오늘 날짜 글자색
          arrowColor: 'tomato',                 // 달력 넘기는 화살표 색
          dotColor: 'tomato',                   // 일정 있는 날 점 색
        }}
        // 한국어 설정 적용
        monthFormat={'yyyy년 MM월'}
        
        // 점 찍기 & 선택 효과 데이터 주입
        markedDates={{
          ...markedDates, // 일정 있는 날짜들 (점)
          [selectedDate]: { // 사용자가 지금 누른 날짜 (동그라미 배경)
            selected: true, 
            marked: markedDates[selectedDate]?.marked, 
            dotColor: 'white' // 선택되면 점을 흰색으로
          }
        }}
        
        // 날짜 누르면 실행할 함수
        onDayPress={handleDayPress}
      />

      {/* 선택한 날짜의 일정 리스트 */}
      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>
          {selectedDate ? `${selectedDate} 일정` : '날짜를 선택해주세요'}
        </Text>

        {filteredSchedules.length > 0 ? (
          <FlatList
            data={filteredSchedules}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.scheduleCard}>
                <Text style={styles.clubName}>{item.club}</Text>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>일정이 없습니다.</Text>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', padding: 20, paddingBottom: 10 },
  
  // 리스트 영역 스타일
  listContainer: { flex: 1, backgroundColor: '#f9f9f9', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, marginTop: 10 },
  listHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  // 카드 스타일
  scheduleCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10,  borderLeftWidth: 5, borderLeftColor: 'tomato',
    // 그림자 효과
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2
  },
  clubName: { fontSize: 12, color: 'gray', marginBottom: 4 },
  scheduleTitle: { fontSize: 16, fontWeight: 'bold' },

  // 빈 화면 스타일
  emptyContainer: { alignItems: 'center', marginTop: 30 },
  emptyText: { color: '#aaa' }
});