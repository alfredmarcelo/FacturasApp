import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import Bodyheader from './Components/BodyHeader';
import FrontPanelCard from './Components/FrontPanelCard';
import IAcard from './Components/IAcard';
import Producto from './Components/MejorProducto';
import VentasyCompras from './Components/VentasyCompras';
import Margen from './Components/Margen';

import EvilIcons from '@react-native-vector-icons/evil-icons';
import NavMenu from '../../Navigation/NavMenu';
import { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Dia from './Components/Dia';
import Noche from './Components/Noche';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Texts from '../../Components/NativeComponents/Text';
import Empleados from './Components/Empleados';

export function FrontPanel() {
  const [abrir, setAbrir] = useState();
  const hora = new Date().getHours();
  const dia = hora >= 6 && hora < 18;
  const noche = hora >= 18 || hora < 6;

  const [total_ventas, setTotal_ventas] = useState(0);

  const Obtener_Total_ventas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.8.106:8000/auth/VentasHoy', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        setTotal_ventas(data);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    Obtener_Total_ventas();
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <NavMenu abrir={abrir} setAbrir={setAbrir} />

      <View
        style={style.body}>
        <ScrollView style={{ paddingBottom: hp("6%") }}
          showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
          <View
            style={{
              padding: wp("1%"),
              backgroundColor: dia ? '#87CEFA' : '#282849ff',
              width: wp("100%"),
              paddingTop: hp("1%"),
            }}
          >
            <EvilIcons
              onPress={() => setAbrir(prev => !prev)}
              name="navicon"
              size={wp("13%")}
              color={dia ? "black" : "white"}
            />
          </View>

          <View style={style.header}>
            {dia ? <Dia total_hoy={total_ventas.total_hoy} total_ayer={total_ventas.total_ayer} /> : <Noche total_hoy={total_ventas.total_hoy} total_ayer={total_ventas.total_ayer} />}
          </View>

          <View style={style.DateSelector}>
            <View style={style.DateSelectorContainer}>
              <TouchableOpacity style={style.DateSelectorContainerItem}>
                <Texts style={{ fontSize: wp("3%") }}>HOY</Texts>
              </TouchableOpacity>
              <Texts style={{ fontSize: wp("3%") }}>|</Texts>
              <TouchableOpacity style={style.DateSelectorContainerItem}>
                <Texts style={{ fontSize: wp("3%") }}>SEMANA</Texts>
              </TouchableOpacity>
              <Texts style={{ fontSize: wp("3%") }}>|</Texts>
              <TouchableOpacity style={style.DateSelectorContainerItem}>
              </TouchableOpacity>
            </View>
          </View>

          <View style={style.Panels}>
            <FrontPanelCard total_ventas={total_ventas.total_hoy} />
          </View>

          <View style={style.IAPanel}>
            <IAcard />
            <Producto />
          </View>

          <View style={style.Empleados}>
            <View style={{ paddingLeft: wp("5%"), width: wp("65%") }}>
              <Text style={{ fontSize: wp("7%"), color: '#535355ff', fontWeight: '500', numberOfLines: 2 }}>
                Empleados
              </Text>
            </View>

            <Empleados />
          </View>

          <View style={style.VentasyCompras}>
            <View style={{ paddingLeft: wp("5%"), width: wp("65%") }}>
              <Text style={{ fontSize: wp("7%"), color: '#535355ff', fontWeight: '500', numberOfLines: 2 }}>
                Resumen de ventas y compras
              </Text>
            </View>

            <View style={style.VentasyComprasContainer}>
              <VentasyCompras />
            </View>
          </View>

          <View style={style.cardsMargen}>
            <Margen />
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  body: {
    width: wp("100%"),
    minHeight: hp("70%"),
    backgroundColor: '#e2e2e2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    height: hp("25%"),
    width: wp("100%"),
  },
  DateSelector: {
    width: wp("100%"),
    height: hp("5%"),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp("1%"),
  },
  DateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp("80%"),
    height: hp("5%"),
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 10,
    gap: wp("1%"),
  },
  DateSelectorContainerItem: {
    width: wp("23%"),
    height: hp("5%"),
    justifyContent: 'center',
    alignItems: 'center',
  },
  Panels: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp("100%"),
    height: hp("26%"),
    marginTop: hp("3%"),
  },
  IAPanel: {
    height: hp("18%"),
    width: wp("100%"),
    flexDirection: 'row',
    justifyContent: 'center',
    padding: wp("2%"),
    alignItems: 'center',
  },
  Empleados: {
    marginTop: hp("4%"),
    width: wp("100%"),
  },

  VentasyCompras: {
    marginTop: hp("4%"),
    width: wp("100%"),
  },

  VentasyComprasContainer: {
    width: wp("100%"),
    height: hp("45%"),
    marginTop: hp("6%"),
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardsMargen: {
    width: wp("100%"),
    padding: wp("3%"),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
