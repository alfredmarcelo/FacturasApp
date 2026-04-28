import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Texts from '../../Components/NativeComponents/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
// RESPONSIVE
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

export default function DatosFacturasCotizacion({
  showFecha,
  showFechaLimite,
  getTipoNCF,
  setgetTipoNC,
  getFechaLimite,
  showTipoNCF,
  setNCF,
  showmetodoPago,
  setmetodoPago,
  setRefrescar,
  refrescar,
  setDescuento,
  tipoCliente,
  getFecha,
  ncf,
  getmetodoPago
}) {

  const fetchs = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('http://192.168.8.106:8000/auth/comprobante', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        comprobante: getTipoNCF,
      }),
    });
    const data = await response.json();
    console.log(data);
    setNCF(data.ncf);
  };

  useEffect(() => {
    if (refrescar) {
      setgetTipoNC('B01');
      setRefrescar(false);
      fetchs();
    } else {
      fetchs();
    }
  }, [getTipoNCF, refrescar]);

  const SelectorItem = ({ label, value, onPress }) => (
    <TouchableOpacity style={style.SelectorItem} onPress={onPress}>
      <View style={style.TextContainer}>
        <Texts style={style.LabelText}>{label}</Texts>
        <Texts style={style.ValueText}>{value}</Texts>
      </View>
      <MaterialIcons name="arrow-drop-down" size={wp('7%')} color="#555" />
    </TouchableOpacity>
  );

  const fecha = new Date();

  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <View style={style.Container}>

      {/* Header */}
      <View style={style.Header}>
        <Texts style={style.HeaderTitle}>Datos</Texts>
      </View>

      {/* Row 1 */}
      <View style={style.Row}>
        <SelectorItem
          label="Fecha"
          value={getFecha || fechaFormateada}
          onPress={() => showFecha(true)}
        />
        <View style={{ width: wp('3%') }} />
        <SelectorItem
          label="Fecha Límite"
          value={getFechaLimite}
          onPress={() => showFechaLimite(true)}
        />
      </View>

      {/* Row 2 */}
      <View style={style.Row}>
        <SelectorItem
          label="Tipo NCF"
          value={getTipoNCF}
          onPress={() => showTipoNCF(true)}
        />

        <View style={{ width: wp('3%') }} />

        <View style={style.NCFDisplay}>
          <Texts style={style.NCFLabel}>Secuencia</Texts>
          <Texts style={style.NCFValue}>{ncf}</Texts>
        </View>
      </View>

      {/* Row 3 - Descuento */}
      <View style={style.Row}>
        <View style={style.DescuentoDisplay}>
          <Texts style={style.DescuentoLabel}>Agregar Descuento</Texts>
          <View style={style.DescuentoValueContainer}>
            <TextInput
              style={style.DescuentoValue}
              placeholder="Agregelo aqui"
              placeholderTextColor={'grey'}
              onChangeText={setDescuento}
              keyboardType='numeric'
              fixedNumberOfLines={1}
            />
            {/* <View style={{ width: wp('20%'), gap: 10, justifyContent: 'center', flexDirection: 'row' }}>
              <TouchableOpacity style={style.DescuentoValues} >
                <Texts>%</Texts>
              </TouchableOpacity>
              <TouchableOpacity style={style.DescuentoValues}>
                <Texts>$</Texts>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>

        <View style={{ width: wp('3%') }} />

        <SelectorItem
          label="Metodo Trasnferencia"
          value={getmetodoPago}
          onPress={() => showmetodoPago(true)}
        />
      </View>


    </View >
  );
}

const style = StyleSheet.create({
  Container: {
    width: wp('100%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },

  Header: {
    marginBottom: hp('2%'),
  },

  HeaderTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
  },

  Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  SelectorItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  TextContainer: {
    flex: 1,
  },

  LabelText: {
    fontSize: wp('3%'),
    color: '#888',
    marginBottom: hp('0.3%'),
  },

  ValueText: {
    fontSize: wp('4%'),
    color: '#000',
  },

  NCFDisplay: {
    flex: 1,
    padding: wp('3%'),
    borderRadius: wp('2%'),
    backgroundColor: '#eef6fc',
    borderColor: '#d1e3f0',
    borderWidth: 1,
    justifyContent: 'center',
  },

  NCFLabel: {
    fontSize: wp('2.5%'),
    color: '#3e697aff',
    textTransform: 'uppercase',
  },

  NCFValue: {
    fontSize: wp('4%'),
    color: '#3e697aff',
    fontWeight: '600',
  },

  DescuentoDisplay: {
    width: wp('45%'),
    padding: wp('1%'),
    borderRadius: wp('2%'),
    backgroundColor: '#fff',
    borderColor: '#d1e3f0',
    borderWidth: 1,
  },
  DescuentoValueContainer: {
    flexDirection: 'column',
    flexdirection: 'row',
    gap: wp('2%'),
  },
  DescuentoValues: {
    fontSize: wp('4%'),
    height: hp('3%'),
    width: wp('7%'),
    color: '#000',
    padding: wp('1%'),
    backgroundColor: '#ffffffff',
    borderRadius: wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 0.1,
    borderColor: '#d1e3f0',
  },

  DescuentoLabel: {
    fontSize: wp('2.5%'),
    color: '#3e697aff',
    textTransform: 'uppercase',
  },

  DescuentoValue: {
    fontSize: wp('4%'),
    color: '#000',
    borderRadius: wp('1.5%'),
    backgroundColor: '#fff',
  },
});
