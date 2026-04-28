import {
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/Navigation/Navigation';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const { height, width } = Dimensions.get('window');

export default function App() {

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ backgroundColor: 'black' }}>
        <NavigationContainer>
          <View style={style.AppHeader}>
            <View style={style.iconsHeader}>
              <Text style={{ color: 'white', fontSize: 12, textAlign: 'center' }}>FacturasPOS</Text>
              <MaterialDesignIcons name="robot" paddingBottom={2} size={25} color="white" />
            </View>
            <View style={style.App}>
              <Navigation />
            </View>
          </View>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const style = StyleSheet.create({
  AppHeader: {
    width: width,
    height: height,
    backgroundColor: 'green',
    justifyContent: 'flex-end',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 2,
    backgroundColor: '#e2e2e2ff',
  },
  iconsHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    gap: 5,
  },
  App: {
    width: '100%',
    height: '96%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'relative',
  },
});
