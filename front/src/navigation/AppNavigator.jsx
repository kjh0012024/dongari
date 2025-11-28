import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClubManagementScreen from '../screens/Management/ClubManagementScreen';
import ClubDetailManagementScreen from '../screens/Management/ClubDetailManagementScreen';
import ClubDetailScreen from '../screens/Club/ClubDetailScreen'; // 일반 동아리 상세

const Stack = createNativeStackNavigator();

export default function ManagementStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClubManagement" component={ClubManagementScreen} options={{ title: '내 동아리 관리' }} />
      <Stack.Screen name="ClubDetail" component={ClubDetailManagementScreen} options={{ title: '동아리 상세' }} />
    </Stack.Navigator>
  );
}
