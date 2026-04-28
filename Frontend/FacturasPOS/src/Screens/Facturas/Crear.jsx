import { Alert, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Keyboard, View, Platform } from 'react-native';
import ComponentsHeader from '../../Components/Headers/ComponentsHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import ClienteCard from '../../Components/Cards/ClientesCard';
import DatosFacturasCotizacion from '../../Components/Cards/DatosFacturasCotizacion';
import Pop from '../../Components/Cards/Pop';
import { useState, useEffect } from 'react';
import Productos from './Productos';
import Texts from '../../Components/NativeComponents/Text';
import FechaSelector from '../../Components/NativeComponents/Fecha';
import FechaLimite from '../../Components/NativeComponents/FechaLimite';
import TipoNCF from './Components/TipoNCF';
import MetodoPago from './Components/MetodoPago';
import LinearGradient from 'react-native-linear-gradient';
import ClientesCambiar from './Components/FlatlistClientesCambiar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// *** IMPORT RESPONSIVE SCREEN ***
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

/* ---------- Paleta y Tipografía ---------- */
const COLORS = {
  primary: '#2563EB',
  primaryGradientStart: '#3B82F6',
  primaryGradientEnd: '#1D4ED8',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  background: '#F3F4F6',
  white: '#FFFFFF',
  shadow: '#000000',
};

const FONT = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

export default function Crear() {
  const navigation = useNavigation();
  const route = useRoute();
  const { DatosCliente } = route.params;

  const [showFecha, setShowFecha] = useState(false);
  const [showFechaLimite, setShowFechaLimite] = useState(false);
  const [showTipoNCF, setshowTipoNCF] = useState(false);
  const [showmetodoPago, setshowmetodoPago] = useState(false);
  const [showClientesCambiar, setShowClientesCambiar] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  const [subtotalArray, setSubtotalArray] = useState([]);
  const [Descuento, setDescuento] = useState(0);
  const [cliente, setCliente] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [ncf, setNCF] = useState('');

  const [getFecha, setgetFecha] = useState('');
  const [getFechaLimite, setgetFechaLimite] = useState('');
  const [getTipoNCF, setgetTipoNC] = useState('');
  const [getmetodoPago, setgetmetodoPago] = useState('');
  const [keyboard, setKeyboard] = useState(false);

  // --- Calculos ---
  console.log(subtotalArray)
  const subtotales = subtotalArray.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const itbis = subtotalArray.reduce(
    (acc, item) => acc + item.precio * item.cantidad * (item.itbis / 100),
    0
  );

  const descuentoNum = Number(Descuento) || 0;
  const total = subtotales + itbis - descuentoNum;

  // --- Manejo de teclado ---
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [datosobtenidos, setDatosObtenidos] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(getmetodoPago)
  const EnviarFacturaCreada = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const ad_id = await AsyncStorage.getItem('ad_id');
      const response = await fetch('http://192.168.8.106:8000/auth/CrearFactura/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cliente_id: cliente.id === "Factura no formal" ? '0' : String(cliente.id),
          ncf,
          tipo_ncf: getTipoNCF,
          fecha_factura: getFecha || new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }),
          fecha_vencimiento: getFechaLimite,
          subtotal: Number(subtotales),
          descuento: Number(descuentoNum),
          itbis: Number(itbis),
          total: Number(total),
          forma_pago: getmetodoPago,
          estado: 'pendiente',
          ad_id: ad_id,
        }),
      });
      const data = await response.json();
      if (data.message == 'Factura agregada correctamente') {
        navigation.navigate('FacturaCreada', {
          subtotal: subtotales,
          itbis: itbis,
          total: total,
          descuento: descuentoNum,
          fecha: getFecha || new Date().toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }),
          fechaLimite: getFechaLimite,
          tipoNCF: getTipoNCF,
          ncf: ncf,
          metodoPago: getmetodoPago,
          productos: subtotalArray,
          cliente: cliente
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // --- Crear factura ---
  const CrearFactura = () => {
    try {
      if (total < 0) {
        Alert.alert('El descuento no puede ser mayor al total');
      }
      else if (subtotalArray.length === 0) {
        Alert.alert('No hay productos en la factura');
      }
      else if (getFechaLimite && getTipoNCF && getmetodoPago && ncf && (cliente.id !== undefined && cliente.id !== '')) {
        EnviarFacturaCreada();
      } else {
        Alert.alert('Completa todos los datos requeridos');
      }
    } catch (error) {
      Alert.alert('Error al crear la factura', error.message);
    }
  };

  return (
    <View style={style.container}>
      <ComponentsHeader onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingBottom: hp('12%') }}>
        <View style={style.Body}>
          <ClienteCard show={true} cliente={setCliente} cambiar={cliente} DatosCliente={DatosCliente} setShowClientesCambiar={setShowClientesCambiar} />
          <DatosFacturasCotizacion
            showFecha={setShowFecha}
            showFechaLimite={setShowFechaLimite}
            showTipoNCF={setshowTipoNCF}
            showmetodoPago={setshowmetodoPago}
            setDescuento={setDescuento}
            setmetodoPago={setMetodoPago}
            setgetTipoNC={setgetTipoNC}
            setRefrescar={setRefrescar}
            refrescar={refrescar}
            tipoCliente={cliente}
            getFechaLimite={getFechaLimite}
            getTipoNCF={getTipoNCF}
            setNCF={setNCF}
            ncf={ncf}
            getFecha={getFecha}
            getmetodoPago={getmetodoPago}
          />

          <View style={style.Productos}>
            <Productos setsubtotal={setSubtotalArray} />
          </View>
        </View>
      </ScrollView>

      {showFecha && <FechaSelector setShowFecha={setShowFecha} setgetFecha={setgetFecha} />}
      {showFechaLimite && (
        <Pop
          show={showFechaLimite}
          setShow={setShowFechaLimite}
          content={<FechaLimite setgetitems={setgetFechaLimite} setShowFechaLimite={setShowFechaLimite} />}
        />
      )}
      {showTipoNCF && (
        <Pop
          show={showTipoNCF}
          setShow={setshowTipoNCF}
          content={<TipoNCF setgetitems={setgetTipoNC} tipoCliente={cliente} setshowTipoNCF={setshowTipoNCF} />}
        />
      )}
      {showmetodoPago && (
        <Pop
          show={showmetodoPago}
          setShow={setshowmetodoPago}
          styleContent={{ width: wp('75%'), height: hp('60%') }}
          content={<MetodoPago setgetitems={setgetmetodoPago} setshowmetodoPago={setshowmetodoPago} />}
        />
      )}

      {showClientesCambiar && (
        <Pop
          show={showClientesCambiar}
          setShow={setShowClientesCambiar}
          styleContent={{ margin: wp('0%') }}
          content={<ClientesCambiar DatosCliente={setCliente} setRefrescar={setRefrescar} setShowClientesCambiar={setShowClientesCambiar} horizontal={false} style={{ width: wp('75%'), height: hp('62%'), }}
            styleContainer={{ gap: wp('6%'), width: wp('75%'), height: hp('12%'), flexDirection: 'row', borderRadius: wp('0%'), borderWidth: wp('0.1%'), borderColor: '#ccc' }} />}
        />
      )}

      <KeyboardAvoidingView
        style={style.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : keyboard ? 50 : 0}
      >
        <View style={style.Footer}>
          <View style={style.FooterDatosContainer}>
            <View style={style.DatosBasicos}>
              <View style={style.Datos}>
                <Texts style={style.DatosBasicosText}>Subtotal: </Texts>
                <Texts style={[style.DatosBasicosText, { color: COLORS.textPrimary }]}>
                  ${subtotales.toFixed(2)}
                </Texts>
              </View>
              <View style={style.Datos}>
                <Texts style={style.DatosBasicosText}>Descuento: </Texts>
                <Texts style={[style.DatosBasicosText, { color: COLORS.textPrimary }]}>
                  ${descuentoNum.toFixed(2)}
                </Texts>
              </View>
              <View style={style.Datos}>
                <Texts style={style.DatosBasicosText}>Itbis: </Texts>
                <Texts style={[style.DatosBasicosText, { color: COLORS.textPrimary }]}>
                  ${itbis.toFixed(2)}
                </Texts>
              </View>
            </View>

            <View style={style.DatosTotal}>
              <Texts style={[style.DatosTotalText, { fontSize: wp('4.5%'), color: COLORS.textSecondary }]}>
                Total
              </Texts>
              <Texts style={[style.DatosTotalText, { color: COLORS.primary }]}>
                ${total.toFixed(2)}
              </Texts>
            </View>
          </View>

          <TouchableOpacity style={style.Buttons} activeOpacity={0.8} onPress={CrearFactura}>
            <LinearGradient
              colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
              style={style.GradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Texts style={{ fontSize: wp('4.5%'), color: 'white', fontFamily: FONT.bold }}>
                Crear Factura
              </Texts>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const style = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e2e2e2ff' },
  Body: {},
  Productos: { width: wp('100%') },
  Footer: {
    width: wp('100%'),
    height: hp('10%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 15,
    position: 'absolute',
    bottom: 0,
  },
  FooterDatosContainer: { width: wp('65%'), height: '100%', flexDirection: 'row', alignItems: 'center' },
  DatosBasicos: {
    width: wp('32%'),
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: hp('0.5%'),
    paddingRight: wp('2%'),
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6',
  },
  Datos: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  DatosTotal: { width: wp('33%'), height: '100%', justifyContent: 'center', alignItems: 'center', gap: hp('0.5%') },
  Buttons: { width: wp('35%'), height: '100%', borderTopRightRadius: wp('5%'), overflow: 'hidden' },
  GradientButton: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  DatosBasicosText: { fontSize: wp('3.5%'), fontFamily: FONT.medium, color: COLORS.textSecondary },
  DatosTotalText: { fontSize: wp('5.5%'), fontFamily: FONT.bold },
});
