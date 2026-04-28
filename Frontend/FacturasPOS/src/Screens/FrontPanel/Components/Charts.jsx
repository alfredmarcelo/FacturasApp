import { View, Text, StyleSheet } from 'react-native';
import EvilIcons from '@react-native-vector-icons/evil-icons';
import Texts from '../../../Components/NativeComponents/Text';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

function Compras({ porcentaje_compras }) {
  return (
    <View style={style.content}>
      <EvilIcons name="arrow-down" size={45} color={'red'} />
      <View style={{ flexDirection: 'column' }}>
        <Texts style={style.HeaderText}>Compras</Texts>
        <Texts style={style.ContentText}>{porcentaje_compras.toFixed(0)}%</Texts>
      </View>
    </View>
  );
}

function Ventas({ porcentaje_ventas }) {
  return (
    <View style={[style.content, { paddingRight: wp('3%') }]}>
      <EvilIcons name="arrow-up" size={45} color={'green'} />
      <View style={{ flexDirection: 'column' }}>
        <Texts style={style.HeaderText}>Ventas</Texts>
        <Texts style={style.ContentText}>{porcentaje_ventas.toFixed(0)}%</Texts>
      </View>
    </View>
  );
}

export default function TypeCharts({ IconType, total_ventas, total_compras }) {
  const ChooseType = () => {
    if (IconType === 'Compras') {
      return <Compras porcentaje_compras={total_compras} />;
    } else if (IconType === 'Ventas') {
      return <Ventas porcentaje_ventas={total_ventas} />;
    }
  };

  return (
    <View>
      <ChooseType />
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    width: wp('28%'),
  },
  HeaderText: {
    fontSize: 13
  },
  ContentText: {
    fontSize: 20
  }
});
