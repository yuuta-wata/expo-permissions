import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useForegroundPermissions, PermissionStatus, getCurrentPositionAsync} from 'expo-location'
import {startActivityAsync, ActivityAction} from 'expo-intent-launcher'

export default function App() {
  const [permissions, requestPermissions] = useForegroundPermissions()

  const {DENIED, GRANTED, UNDETERMINED} = PermissionStatus
  const {LOCATION_SOURCE_SETTINGS} = ActivityAction

  const openAppSettingsPage = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    }

    if (Platform.OS === 'android') {
      startActivityAsync(LOCATION_SOURCE_SETTINGS)
    }
  }

  

  return (
    <View style={styles.container}>
      <Text>permissions states: {permissions?.status}</Text>
      <TouchableOpacity style={styles.permissionButton} onPress={async () => {
        const {status} = await requestPermissions()
        console.log('status:', status);
        
        if (status === DENIED) {
          Alert.alert('位置情報を取得しませんでした。', '再度設定するには設定画面へ移動してください。', [
            {text: 'キャンセル', style: 'cancel'},
            {text: '移動する', onPress: openAppSettingsPage}
          ])
          return;
        }

        const location = await getCurrentPositionAsync()
        console.log('location:', location);     
      }}>
        <Text>Permission</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButton: {
    backgroundColor: 'pink',
    padding: 20
  }
});
