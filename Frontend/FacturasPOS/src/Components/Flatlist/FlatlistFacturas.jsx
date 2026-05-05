import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Texts from '../NativeComponents/Text';

import MaterialIcons from '@react-native-vector-icons/material-icons';
import Feather from '@react-native-vector-icons/feather';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export default function FlatlistFacturas({ nombre, data }) {

  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const getData = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://192.168.8.106:8000/auth/Facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      const facturas = await res.json();
      setFacturas(facturas.factura);
      console.log(facturas);

    } catch (error) {
      console.log(error);
    }
  };

  const deleteFactura = async () => {
    if (!selectedFactura) {
      Alert.alert('Aviso', 'Selecciona una factura primero (mantén presionado)');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar la factura #${selectedFactura.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`http://192.168.8.106:8000/auth/EliminarFactura/${selectedFactura.id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (res.ok) {
                // Eliminar del estado local
                setFacturas(prev => prev.filter(f => f.id !== selectedFactura.id));
                setSelectedFactura(null);
                Alert.alert('Éxito', 'Factura eliminada correctamente');
              } else {
                Alert.alert('Error', 'No se pudo eliminar la factura');
              }
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Error de conexión');
            }
          },
        },
      ]
    );
  };

  const handleLongPress = (item) => {
    setSelectedFactura(item);
  };

  const handlePress = () => {
    // Deseleccionar al presionar normalmente
    setSelectedFactura(null);
  };

  useEffect(() => {
    getData(data);
  }, [data]);

  const NohayFacturas = () => {
    return (
      <View style={styles.noHayFacturas}>
        <Texts>No hay facturas</Texts>
      </View>
    );
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearMoneda = (valor) => {
    const numero = Number(valor) || 0;
    return numero.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  return (
    <View style={styles.Container}>

      {/* ---------- HEADER ---------- */}
      <View style={styles.headerContainer}>

        <View style={styles.headerRight}>
          <Texts style={{ fontSize: wp("4.5%") }}>{nombre}</Texts>
        </View>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerbutton} onPress={deleteFactura}>
            <MaterialIcons name="delete-outline" size={wp("6%")} color={selectedFactura ? "#e53935" : "#000"} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerbutton}>
            <Feather name="send" size={wp("5.2%")} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerbutton}></TouchableOpacity>
        </View>
      </View>

      {/* -------- LISTA -------- */}
      <FlatList
        data={facturas}
        style={{ width: wp("100%"), marginBottom: 13 }}
        contentContainerStyle={{ justifyContent: "center", backgroundColor: "#ebe7e7ff", alignItems: "center" }}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={NohayFacturas}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedFactura?.id === item.id && styles.cardSelected
            ]}
            onLongPress={() => handleLongPress(item)}
            onPress={handlePress}
            delayLongPress={300}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardID}>
                <Texts style={{ fontSize: wp("4%"), color: "white", fontWeight: "bold" }}>{item.id}</Texts>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: wp("1.5%") }}>
                <Feather name="calendar" size={wp("4%")} color="black" />
                <Texts style={{ fontSize: wp("3.5%"), fontWeight: "500", color: "#444" }}>{formatearFecha(item.fecha)}</Texts>
              </View>
              <View style={styles.cardNCF}>
                <Texts style={{ fontSize: wp("4%"), color: "white", fontWeight: "bold" }}>{item.ncf}</Texts>
              </View>
            </View>
            <View style={styles.cardBlockContainer}>
              <View style={styles.cardBlock}>
                <View style={{ alignItems: "center" }}>
                  <Texts style={{ fontSize: wp("4%"), color: "black" }}>ITBIS</Texts>
                  <Texts style={{ fontSize: wp("4%"), color: "#635f5fff" }}>{formatearMoneda(item.itbis)}</Texts>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Texts style={{ fontSize: wp("4%"), color: "black" }}>Subtotal</Texts>
                  <Texts style={{ fontSize: wp("4%"), color: "#635f5fff" }}>{formatearMoneda(item.subtotal)}</Texts>
                </View>
              </View>

              <View style={styles.cardRight}>
                <Texts style={{ fontSize: wp("4%"), color: "grey", top: hp("0.2%") }}>RD$</Texts>
                <Texts style={{ fontSize: wp("6%"), color: "#2c2c2cff", fontWeight: "300", top: hp("0.5%") }}>{formatearMoneda(item.total)}</Texts>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: wp("2%"),
    borderTopLeftRadius: wp("2%"),
    backgroundColor: '#e2e2e2ff',
    paddingBottom: hp("2%"),
  },

  noHayFacturas: {
    width: wp("100%"),
    height: hp("50%"),
    justifyContent: "center",
    alignItems: "center",
  },

  /* ---------------- HEADER ---------------- */

  headerContainer: {
    width: wp("100%"),
    height: hp("6.5%"),
    backgroundColor: "#ebe7e7ff",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  headerLeft: {
    width: wp("50%"),
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: wp("5%"),
    alignItems: "center",
    gap: wp("4%"),
    borderTopWidth: 1,
    borderColor: "white",
    borderRadius: wp("100%"),
  },

  headerRight: {
    width: wp("50%"),
    height: "100%",
    backgroundColor: "white",
    borderBottomRightRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },

  headerbutton: {
    width: wp("11%"),
    height: hp("5%"),
    borderRadius: wp("6%"),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },

  /* ---------------- CARDS ---------------- */

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardBlockContainer: {
    width: wp("95%"),
    height: hp("7%"),
    flexDirection: "row",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#ffffffff",
    height: hp("12%"),
    width: wp("95%"),
    borderRadius: wp("3%"),
    marginTop: hp("1.5%"),
    flexDirection: "column",
    elevation: 3,
    borderWidth: 0.1,
    borderColor: "#e2e2e29d",
  },

  cardNCF: {
    width: wp("40%"),
    borderTopRightRadius: wp("3%"),
    borderBottomStartRadius: wp("6%"),
    height: hp("4%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1dbe18cc",
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: "#e53935",
    backgroundColor: "#fff5f5",
  },

  cardID: {
    width: wp("10%"),
    borderTopLeftRadius: wp("3%"),
    borderBottomEndRadius: wp("6%"),
    height: hp("4.5%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f7f0cff",
  },

  cardBlock: {
    width: wp("50%"),
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    gap: hp("3%"),
    paddingRight: wp("6%"),
    right: wp("1%"),
    flexDirection: "row",
  },

  cardRight: {
    width: wp("30%"),
    justifyContent: "center",
    alignItems: "center",
    height: hp("7%"),
    flexDirection: "row",
    gap: wp("1%"),
  },
});
