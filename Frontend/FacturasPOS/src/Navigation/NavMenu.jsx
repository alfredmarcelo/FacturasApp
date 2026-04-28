import { useEffect } from 'react';
import Texts from '../Components/NativeComponents/Text';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import Items from './Items';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NavMenu({ abrir, setAbrir }) {

  const ad_nombre = AsyncStorage.getItem('ad_nombre');
  const ad_apellido = AsyncStorage.getItem('ad_apellido');
  const ad_rnc = AsyncStorage.getItem('ad_rnc');

  const navigation = useNavigation();

  // 🔥 Valores responsive equivalentes a tus 110 y 500px
  const MENU_OPEN = wp('25%');   // ~110px según pantalla
  const MENU_CLOSE = wp('100%'); // ~500px o full width

  const right = useSharedValue(MENU_CLOSE); // posición inicial del menú

  // animación de la posición del menú (NO se modificó)
  useEffect(() => {
    right.value = abrir ? withSpring(MENU_OPEN) : withSpring(MENU_CLOSE);
  }, [abrir]);

  // estilo animado del menú
  const menuStyle = useAnimatedStyle(() => ({
    right: right.value,
  }));

  // fondo oscurecido animado
  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(right.value, [MENU_CLOSE, MENU_OPEN], [0, 0.5]),
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      {abrir && (
        <TouchableWithoutFeedback onPress={() => setAbrir(false)}>
          <Animated.View style={[styles.background, backgroundStyle]} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.container, menuStyle]}>
        <View style={{ width: wp('100%'), height: hp('100%') }}>
          {/* HEADER DEL MENÚ */}
          <View style={styles.Header}>
            <View style={styles.Avatar} />

            <View style={styles.ContentHeader}>
              <Texts style={styles.HeaderTitle}>{ad_nombre} {ad_apellido}</Texts>
              <Texts style={styles.HeaderSub}>{ad_rnc}</Texts>
            </View>
          </View>

          {/* CONTENIDO */}
          <View style={styles.Content}>
            <ScrollView style={{ paddingBottom: '100%' }}>
              <Items
                Nombre={'Inicio'}
                NombreItem1={'Inicio'}
                NombreItem2={'Anna Contable'}
                onPress1={() => {
                  navigation.navigate('FrontPanel'), setAbrir(prev => !prev);
                }}
                onPress2={() => {
                  navigation.navigate('Anna'), setAbrir(prev => !prev);
                }}
              />

              <Items
                Nombre={'Contabilidad'}
                NombreItem1={'Facturas'}
                NombreItem2={'Cotizaciones'}
                NombreItem3={'Gastos'}
                NombreItem4={'Compras'}
                NombreItem5={'Reportes'}
                onPress1={() => {
                  navigation.navigate('FrontPanelFacturas'),
                    setAbrir(prev => !prev);
                }}
                onPress2={() => {
                  navigation.navigate('FrontPanelCotizaciones'),
                    setAbrir(prev => !prev);
                }}
                onPress3={() => {
                  navigation.navigate('FrontPanelGastos'),
                    setAbrir(prev => !prev);
                }}
                onPress4={() => {
                  navigation.navigate('FrontPanelCompras'),
                    setAbrir(prev => !prev);
                }}
                onPress5={() => {
                  navigation.navigate('Reportes'),
                    setAbrir(prev => !prev);
                }}
              />

              <Items
                Nombre={'POS'}
                NombreItem1={'Productos'}
                NombreItem2={'Clientes'}
                onPress1={() => {
                  navigation.navigate('Productos'), setAbrir(prev => !prev);
                }}
                onPress2={() => {
                  navigation.navigate('Clientes'), setAbrir(prev => !prev);
                }}
              />
              <Items
                Nombre={'CRM'}
                NombreItem1={'WhatsApp'}
                onPress1={() => {
                  navigation.navigate('Whatsapp'), setAbrir(prev => !prev);
                }}
                NombreItem2={'Facebook'}
                onPress2={() => {
                  navigation.navigate('Whatsapp'), setAbrir(prev => !prev);
                }}
                NombreItem3={'Instagram'}
                onPress3={() => {
                  navigation.navigate('Whatsapp'), setAbrir(prev => !prev);
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp('75%'),
    height: hp('100%'),
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'white',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: -wp('1%'), height: 0 },
    overflow: 'hidden',
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  Header: {
    width: wp('100%'),
    height: hp('17%'),
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    gap: wp('4%'),
    elevation: 6,
  },

  Avatar: {
    width: wp('18%'),
    height: wp('18%'),
    backgroundColor: 'white',
    borderRadius: 100,
    elevation: 6,
  },

  ContentHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: hp('0.5%'),
  },

  HeaderTitle: {
    fontSize: wp('4.5%'),
    color: 'white',
    fontWeight: '600',
  },

  HeaderSub: {
    fontSize: wp('3.2%'),
    color: 'white',
    opacity: 0.8,
  },

  Content: {
    width: '100%',
    height: hp('83%'),
    paddingBottom: hp('4%'),
  },
});
