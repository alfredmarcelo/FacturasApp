import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import EvilIcons from '@react-native-vector-icons/evil-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';

import Clientes from '../../Components/Flatlist/FlatlistClientes';
import FlatlistFacturas from '../../Components/Flatlist/FlatlistFacturas';
import Texts from '../../Components/NativeComponents/Text';
import ScreensComponentHeader from '../../Components/Headers/ScreensComponentHeader';
import EncabezadoScreen from '../../Components/Cards/EncabezadoScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function FrontPanelFacturas() {
  const navigation = useNavigation();

  const [abrir, setAbrir] = useState(false);
  const [DatosCliente, setDatosCliente] = useState({});
  const [cambiarcolor, setCambiarcolor] = useState('Clientes');

  const [searchText, setSearchText] = useState('');
  const [clientesBackend, setClientesBackend] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  /* ================= FETCH ================= */
  const fetchClientes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        'http://192.168.8.106:8000/auth/GetClientes',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setClientesBackend(data.clientes || []);
    } catch (error) {
      console.log('ERROR CLIENTES:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  /* ======= sincroniza filtro cuando llega backend ======= */
  useEffect(() => {
    setFilteredData(clientesBackend);
  }, [clientesBackend]);

  /* ================= FILTRO ================= */
  const filterData = (text) => {
    if (!text) {
      setFilteredData(clientesBackend);
      return;
    }

    setFilteredData(
      clientesBackend.filter((item) =>
        item.nombre.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    >
      <View style={styles.container}>
        <ScreensComponentHeader abrir={abrir} setAbrir={setAbrir} />

        <EncabezadoScreen
          navigation={navigation}
          Datos={DatosCliente}
          onPress={() =>
            navigation.navigate('Crear', {
              DatosCliente: DatosCliente,
            })
          }
          nombre="Facturas"
          agregar_button={true}
        />

        {/* ====== CLIENTES ====== */}
        <View style={styles.clientesSection}>
          <View style={styles.clientesHeader}>
            <View style={styles.clientesButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.headerButton,
                  { backgroundColor: cambiarcolor === 'Clientes' ? 'white' : 'transparent' },
                ]}
                onPress={() => setCambiarcolor('Clientes')}
              >
                <Texts>Clientes</Texts>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.headerButton,
                  { backgroundColor: cambiarcolor === 'Proveedores' ? 'white' : 'transparent' },
                ]}
                onPress={() => setCambiarcolor('Proveedores')}
              >
                <Texts>Proveedores</Texts>
              </TouchableOpacity>
            </View>

            {/* ===== SEARCH ===== */}
            <View style={styles.searchBar}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={(text) => {
                    setSearchText(text);
                    filterData(text);
                  }}
                  blurOnSubmit={false}
                />
              </View>
              <EvilIcons
                name="search"
                size={wp('8%')}
                style={{ position: 'absolute', right: wp('2%'), top: hp('0.5%') }}
              />
            </View>
          </View>

          <Clientes
            setDatosCliente={setDatosCliente}
            DatosCliente={DatosCliente}
            filteredData={filteredData}
          />
        </View>

        {/* ===== FACTURAS ===== */}
        <View style={styles.facturasContainer}>
          <FlatlistFacturas nombre="Facturas" data={DatosCliente?.id} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e2e2ff',
  },

  menuBar: {
    padding: hp('0.7%'),
    backgroundColor: '#e2e2e2ff',
  },

  clientesSection: {
    width: '100%',
    paddingHorizontal: wp('3%'),
    marginTop: hp('0.8%'),
  },

  clientesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  clientesButtonsRow: {
    flexDirection: 'row',
    gap: wp('2.5%'),
    width: wp('49%'),
    backgroundColor: '#c5c2c280',
    borderRadius: wp('2.5%'),
    padding: wp('1%'),
  },

  headerButton: {
    backgroundColor: 'white',
    borderRadius: wp('2.5%'),
    backgroundColor: '#e2e2e2ff',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('22%'),
    height: hp('3.7%'),
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
  },

  searchInputContainer: {
    width: wp('42%'),
    height: hp('4.5%'),
    backgroundColor: 'white',
    borderRadius: wp('2.5%'),
    justifyContent: 'center',
    elevation: 5,
  },

  searchInput: {
    color: 'black',
    paddingHorizontal: wp('2%'),
    fontSize: wp('3.5%'),
    width: wp('33%'),
  },

  facturasContainer: {
    flex: 1,
    marginTop: hp('1%'),
  },
});