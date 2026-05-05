import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Texts from '../NativeComponents/Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// IMPORTANTE: responsive
import { widthPercentageToDP as wp, heightPercentageToDP as hp }
  from 'react-native-responsive-screen';

export default function ClienteCard({
  show,
  DatosCliente,
  setShowClientesCambiar,
  cliente,
  cambiar
}) {
  const nombreMostrar = cambiar?.nombre || DatosCliente?.nombre || 'Factura no formal';
  const cedulaMostrar = cambiar?.cedula_rnc || DatosCliente?.cedula_rnc || 'Factura no formal';

  useEffect(() => {
    cliente({ id: cambiar?.id || DatosCliente?.id || 'Factura no formal', nombre: nombreMostrar, cedula_rnc: cedulaMostrar })
  }, []);

  return (
    <View style={style.CardContainer}>

      {/* Header */}
      <View style={style.Header}>
        <Texts style={style.Title}>Cliente</Texts>

        {show && (
          <TouchableOpacity onPress={() => setShowClientesCambiar(true)} activeOpacity={0.7}>
            <Texts style={style.LinkText}>Cambiar</Texts>
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      <View style={style.Body}>

        {/* Avatar */}
        <View style={style.AvatarContainer}>
          <View style={style.AvatarCircle}>
            <Image
              source={{ uri: `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(nombreMostrar)}&radius=0` }}
              style={{ width: wp('16%'), height: wp('16%'), borderRadius: wp('8%') }}
            />
          </View>
        </View>

        {/* Text Info */}
        <View style={style.InfoContainer}>
          <Texts style={style.NameText} numberOfLines={1}>
            {nombreMostrar}
          </Texts>
          <Texts style={style.RNCText}>{cedulaMostrar}</Texts>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  CardContainer: {
    width: wp('100%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
  },

  Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },

  Title: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
  },

  LinkText: {
    color: '#3e697aff',
    fontWeight: '500',
    fontSize: wp('3.5%'),
  },

  Body: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  AvatarContainer: {
    marginRight: wp('4%'),
  },

  AvatarCircle: {
    width: wp('16%'),
    height: wp('16%'),
    backgroundColor: '#f0f0f0',
    borderRadius: wp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  InfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  NameText: {
    fontSize: wp('4.5%'),
    color: '#000',
    marginBottom: hp('0.5%'),
  },

  RNCText: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
});
