import { View } from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design'
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default function ComponentsHeader({ onPress }) {
  return (
    <View
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
        backgroundColor: '#e2e2e2ff',
      }}
    >
      <AntDesign onPress={onPress} name="arrow-left" size={wp('8%')} />
    </View>
  );
}
