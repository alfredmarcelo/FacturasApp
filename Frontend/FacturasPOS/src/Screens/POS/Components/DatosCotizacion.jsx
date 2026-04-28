import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Texts from '../../../Components/NativeComponents/Text';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const TIPOS_PRODUCTO = [
  { id: '1', label: 'Alimento' },
  { id: '2', label: 'Bebida' },
  { id: '3', label: 'Limpieza' },
  { id: '4', label: 'Electrónica' },
  { id: '5', label: 'Ropa' },
  { id: '6', label: 'Salud' },
  { id: '7', label: 'Hogar' },
  { id: '8', label: 'Otro' },
];

const SelectorItem = ({ placeholder, placeholder2, value, value2, onChangeText, onChangeText2, numeric, numeric2 }) => (
  <View style={style.Row}>
    <View style={style.DescuentoDisplay}>
      <View style={style.DescuentoValueContainer}>
        <TextInput
          style={style.DescuentoValue}
          placeholder={placeholder}
          value={value}
          placeholderTextColor={'grey'}
          onChangeText={onChangeText}
          keyboardType={numeric ? 'numeric' : 'default'}
          numberOfLines={1}
        />
      </View>
    </View>
    {placeholder2 && <View style={style.DescuentoDisplay}>
      <View style={style.DescuentoValueContainer}>
        <TextInput
          style={style.DescuentoValue}
          placeholder={placeholder2}
          value={value2}
          placeholderTextColor={'grey'}
          onChangeText={onChangeText2}
          keyboardType={numeric2 ? 'numeric' : 'default'}
          numberOfLines={1}
        />
      </View>
    </View>}
  </View>
);

export default function DatosCotizacion({
  setTipoProducto,
  TipoProducto,
  setNombre,
  Nombre,
  setPrecio,
  Precio,
  setPrecioPorMayor,
  PrecioPorMayor,
  setITBIS,
  ITBIS,
  setDescuento,
  Descuento,
  setDescripcion,
  Descripcion,
}) {
  const [showTipos, setShowTipos] = useState(false);

  return (
    <View style={style.Container}>

      {/* Header */}
      <View style={style.Header}>
        <Texts style={style.HeaderTitle}>Datos</Texts>
      </View>

      {/* Row 1 - Tipo de producto (selector) + Nombre */}
      <View style={style.Row}>
        <TouchableOpacity
          style={style.DescuentoDisplay}
          onPress={() => setShowTipos(true)}
        >
          <View style={style.DescuentoValueContainer}>
            <TextInput
              style={style.DescuentoValue}
              placeholder="Tipo de producto"
              value={TipoProducto}
              placeholderTextColor={'grey'}
              editable={false}
              numberOfLines={1}
            />
          </View>
        </TouchableOpacity>

        <View style={style.DescuentoDisplay}>
          <View style={style.DescuentoValueContainer}>
            <TextInput
              style={style.DescuentoValue}
              placeholder="Nombre"
              value={Nombre}
              placeholderTextColor={'grey'}
              onChangeText={setNombre}
              numberOfLines={1}
            />
          </View>
        </View>
      </View>

      {/* Row 2 - Precios */}
      <SelectorItem placeholder={"Precio"}
        value={Precio}
        onChangeText={setPrecio}
        placeholder2={"Por mayor (Opcional)"}
        value2={PrecioPorMayor}
        onChangeText2={setPrecioPorMayor}
        numeric={true}
        numeric2={true} />
      {/* Row 3 - ITBIS y Descuento */}
      <SelectorItem placeholder={"ITBIS (%)"}
        value={ITBIS}
        onChangeText={setITBIS}
        placeholder2={"Descuento (%)"}
        value2={Descuento}
        onChangeText2={setDescuento}
        numeric={true}
        numeric2={true} />
      {/* Row 4 - Descripción */}
      <SelectorItem placeholder={"Descripción"} value={Descripcion} onChangeText={setDescripcion} />

      {/* Modal selector de tipos */}
      <Modal visible={showTipos} transparent animationType="fade">
        <TouchableOpacity
          style={style.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTipos(false)}
        >
          <View style={style.modalContent}>
            <Texts style={style.modalTitle}>Tipo de producto</Texts>
            <FlatList
              data={TIPOS_PRODUCTO}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={style.modalItem}
                  onPress={() => {
                    setTipoProducto(item.label);
                    setShowTipos(false);
                  }}
                >
                  <Texts style={[
                    style.modalItemText,
                    TipoProducto === item.label && { color: '#2563EB', fontWeight: '700' }
                  ]}>
                    {item.label}
                  </Texts>
                  {TipoProducto === item.label && (
                    <MaterialIcons name="check" size={wp('5%')} color="#2563EB" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View >
  );
}

const style = StyleSheet.create({
  Container: {
    width: wp('100%'),
    height: hp('55%'),
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

  /* Modal selector */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp('75%'),
    maxHeight: hp('50%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    paddingVertical: hp('2%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: wp('4%'),
    color: '#333',
  },
});
