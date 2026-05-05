import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Texts from '../NativeComponents/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function Clientes({ setDatosCliente, DatosCliente, filteredData }) {

  const handleSelect = (item) => {
    setDatosCliente(item);
  };

  const handleSelectNoFormal = () => {
    setDatosCliente({ id: 0, nombre: 'Factura no formal' }); // Identificador para facturas no formales
  };

  // --- Estilos ---
  const containerStyle = {
    flexDirection: "row",
    paddingVertical: hp("1%"),
  };

  const cardStyle = {
    width: wp("32%"),
    height: hp("14%"),
    marginRight: wp('2%'),
    borderRadius: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: wp("3%"),
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: wp("1.5%"),
  };

  const nameStyle = {
    fontSize: wp("3.5%"),
    color: "#333",
    textAlign: "center",
    marginTop: hp("0.5%"),
  };

  const rncStyle = {
    fontSize: wp("3%"),
    color: "#777",
    marginTop: hp("0.5%"),
    textAlign: "center",
  };

  const avatarStyle = {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: "grey",
    borderRadius: wp("10%"),
    marginBottom: hp("0.1%"),
  };

  return (
    <View style={containerStyle}>

      {/* LISTA DE CLIENTES */}
      <FlatList
        data={filteredData}
        horizontal
        keyboardShouldPersistTaps="always"
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <TouchableOpacity style={cardStyle} onPress={() => handleSelectNoFormal()}>
            <Texts
              style={{
                fontSize: wp("5%"),
                fontWeight: "500",
                color: "#444",
                textAlign: "center",
              }}
            >
              No formales
            </Texts>
          </TouchableOpacity>
        }
        renderItem={({ item }) => {
          const isSelected = DatosCliente?.id === item.id;

          return (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={[
                cardStyle,
                {
                  backgroundColor: isSelected ? "#a4e8a3" : "white",
                  borderWidth: isSelected ? wp("0.5%") : 0,
                  borderColor: isSelected ? "#388e3c" : "transparent",
                },
              ]}
            >
              <View style={avatarStyle}>
                <Image
                  source={{ uri: `https://api.dicebear.com/9.x/thumbs/png?seed=${encodeURIComponent(item.nombre)}&radius=0` }}
                  style={{ width: wp("12%"), height: wp("12%"), borderRadius: wp("50%") }}
                />
              </View>
              <Texts style={nameStyle}>{item.nombre}</Texts>
              <Texts style={rncStyle}>{item.cedula_rnc}</Texts>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
