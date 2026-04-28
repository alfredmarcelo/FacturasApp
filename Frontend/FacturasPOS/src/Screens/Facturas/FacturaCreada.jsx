import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Texts from '../../Components/NativeComponents/Text';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import AntDesign from '@react-native-vector-icons/ant-design';
import EvilIcons from '@react-native-vector-icons/evil-icons';
import NavMenu from '../../Navigation/NavMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreensComponentHeader from '../../Components/Headers/ScreensComponentHeader';

export default function FacturaCreada() {
  const navigation = useNavigation();
  const {
    subtotal,
    itbis,
    total,
    descuento,
    fecha,
    fechaLimite,
    tipoNCF,
    productos,
    cliente
  } = useRoute().params;


  const ad_nombre = AsyncStorage.getItem('ad_nombre');
  const ad_apellido = AsyncStorage.getItem('ad_apellido');
  const ad_rnc = AsyncStorage.getItem('ad_rnc');

  return (
    <>
      <NavMenu />
      <ScreensComponentHeader />
      <View style={styles.container}>
        {/* TODO JUNTO — ENCABEZADO */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', margin: 10 }}>
          <Texts style={{ fontSize: wp('5%') }}>Factura creada exitosamente</Texts>
          <AntDesign name='check-circle' size={wp('5')} color={'green'} style={{ paddingTop: 5 }} />
        </View>
        <View style={styles.HeaderContainer}>
          <View style={styles.Header}>
            <Texts style={styles.text}>RNC: {cliente.cedula_rnc}</Texts>
            <Texts style={styles.text}>RNC Emisor: {ad_rnc}</Texts>
            <Texts style={styles.text}>NCF: {tipoNCF}</Texts>
            <Texts style={styles.text}>Fecha: {fecha}</Texts>
            <Texts style={styles.text}>Fecha Limite: {fechaLimite}</Texts>
            <Texts style={styles.text}>Nombre Empresa Receptora: {ad_nombre} {ad_apellido}</Texts>

            <Texts style={styles.divider}>-----------------------------------------</Texts>
            <Texts style={styles.title}>FACTURA DE CRÉDITO FISCAL</Texts>
            <Texts style={styles.divider}>-----------------------------------------</Texts>
          </View>

          {/* TODO JUNTO — COLUMNAS */}
          <View style={styles.ColumnHeaderRow}>
            <View style={[styles.col45]}>
              <Texts style={styles.columnText}>DESCRIPCIÓN</Texts>
            </View>
            <View style={styles.col}>
              <Texts style={styles.columnText}>VALOR</Texts>
            </View>
            <View style={styles.col}>
              <Texts style={styles.columnText}>ITBIS</Texts>
            </View>
          </View>

          {/* TODO JUNTO — PRODUCTOS */}
          <FlatList
            data={productos}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              width: wp('85%'),
            }}
            style={styles.list}
            renderItem={({ item }) => (
              <View style={styles.ItemRow}>

                <View style={[styles.col45, { alignItems: 'flex-start' }]}>
                  <Texts style={styles.productName}>{item.nombre}</Texts>
                  <Texts style={styles.productDetails}>
                    x{item.cantidad} - {item.precio}
                  </Texts>
                </View>

                <View style={styles.col}>
                  <Texts>
                    {(item.precio * item.cantidad).toFixed(2)}
                  </Texts>
                </View>

                <View style={styles.col}>
                  <Texts>
                    {((item.itbis / 100) * item.precio).toFixed(2)}
                  </Texts>
                </View>

              </View>
            )}
          />

          {/* TODO JUNTO — PIE DE FACTURA */}
          <View style={styles.Footer}>
            <Texts style={styles.divider}>-----------------------------------------</Texts>

            <View style={styles.FooterRow}>
              <View>
                <Texts>Subtotal:</Texts>
                <Texts>ITBIS:</Texts>
                <Texts>Descuento:</Texts>
                <Texts>Total:</Texts>
              </View>

              <View>
                <Texts>RD$ {subtotal.toFixed(2)}</Texts>
                <Texts>RD$ {itbis.toFixed(2)}</Texts>
                <Texts>RD$ {Number(descuento).toFixed(2)}</Texts>
                <Texts>RD$ {total.toFixed(2)}</Texts>
              </View>
            </View>
          </View>

        </View>

        <Texts style={{ padding: 10, paddingRight: wp('21%'), color: 'grey' }}>Enviar: </Texts>
        <View style={styles.ButtonsContainer}>
          <TouchableOpacity style={styles.btnContinuar}>
            <FontAwesome name="share-square-o" size={wp('10%')} color="#000000ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnContinuar}>
            <AntDesign name="qrcode" size={wp('8%')} color="#8a5c5cff" />
          </TouchableOpacity>
          <View style={{ width: 1.5, height: hp('6%'), backgroundColor: 'grey' }}></View>
          <TouchableOpacity style={styles.btnContinuar}>
            <AntDesign name="plus" size={wp('8%')} color="#000000ff" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp('3%'),
  },

  /* HEADER */
  Header: {
    width: wp('85%'),
    backgroundColor: 'white',
    padding: wp('4%'),
    alignItems: 'flex-start',
  },
  ButtonsContainer: {
    flexDirection: 'row',
    width: wp('85%'),
    gap: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContinuar: {
    backgroundColor: '#ffffffff',
    width: wp('15%'),
    height: hp('7%'),
    borderRadius: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 5,
  },
  HeaderContainer: {
    width: wp('85%'),
    backgroundColor: 'white',
    alignItems: 'flex-start',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: hp('2%'),
  },

  text: {
    fontSize: hp('1.8%'),
  },

  divider: {
    alignSelf: 'center',
    fontSize: hp('1.7%'),
  },

  title: {
    alignSelf: 'center',
    fontSize: hp('2%'),
  },

  /* COLUMNAS */
  ColumnHeaderRow: {
    flexDirection: 'row',
    width: wp('85%'),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ccc',
  },

  columnText: {
    fontSize: hp('1.7%'),
  },

  col45: {
    width: '45%',
    alignItems: 'center',
  },

  col: {
    width: '27.5%',
    alignItems: 'center',
  },

  /* PRODUCTOS */
  list: {
    width: wp('85%'),
    maxHeight: hp('25%'),
    backgroundColor: 'white'
  },

  ItemRow: {
    flexDirection: 'row',
    width: '100%',
    height: hp('6%'),
    borderBottomWidth: 0.7,
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },

  productName: {
    fontSize: hp('1.7%'),
  },

  productDetails: {
    fontSize: hp('1.4%'),
    color: '#777',
  },

  /* FOOTER */
  Footer: {
    width: wp('85%'),
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10
  },

  FooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
