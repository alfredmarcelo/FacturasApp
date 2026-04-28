import { View, StyleSheet } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Producto() {
  return (
    <View style={style.content}>
      <View style={style.Body}>
        <View style={style.ProductoImagen} />

        <View style={style.Productos}>
          <Texts style={style.title}>Producto Estrella</Texts>
          <Texts style={style.subtitle}>Ventas totales</Texts>
          <Texts style={style.info}>250 | 15,000</Texts>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    width: wp('52%'),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp('2%'),
    marginRight: wp('2%'),
  },

  Body: {
    width: wp('51%'),
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    backgroundColor: 'white',
    borderRadius: 20,

    // sombreado elegante
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,

    padding: 12,
  },

  ProductoImagen: {
    width: '40%',
    height: '95%',
    borderRadius: 14,
    backgroundColor: '#dcdcdc',
  },

  Productos: {
    width: '55%',
    height: '90%',
    justifyContent: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },

  info: {
    marginTop: 6,
    fontSize: 13,
    color: '#444',
  },
});
