import { View, Animated, Easing, Image } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef } from 'react';

export default function BodyHeader() {

  // Animación de flotación
  const move1 = useRef(new Animated.Value(0)).current;
  const move2 = useRef(new Animated.Value(0)).current;
  const move3 = useRef(new Animated.Value(0)).current;

  const moonMove = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = (control, delay = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(control, {
            toValue: 1,
            duration: 4000,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(control, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    float(move1);
    float(move2, 1500);
    float(move3, 800);
    float(moonMove, 2000);
  }, []);

  // Traducciones suaves
  const translate = (val, x, y) =>
    val.interpolate({
      inputRange: [0, 1],
      outputRange: [0, y],
    });

  return (
    <LinearGradient
      colors={['#282849ff', '#1d2d57ff']}
      style={{
        width: wp('100%'),
        height: hp('40%'),
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >

      {/* 🌙 Luna */}
      <Animated.View
        style={{
          position: 'absolute',
          top: hp('3%'),
          right: wp('5%'),
          width: 45,
          height: 45,
          borderRadius: 30,
          backgroundColor: '#fdfdfdcc',
          transform: [
            { translateY: moonMove.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) }
          ]
        }}
      />

      {/* ✨ Estrellas */}
      <Animated.View
        style={{
          position: 'absolute',
          top: hp('12%'),
          left: wp('10%'),
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'white',
          opacity: 0.8,
          transform: [{ translateY: translate(move1, 0, 6) }],
        }}
      />

      <Animated.View
        style={{
          position: 'absolute',
          top: hp('6%'),
          left: wp('40%'),
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: 'white',
          opacity: 0.7,
          transform: [{ translateY: translate(move2, 0, 10) }],
        }}
      />

      <Animated.View
        style={{
          position: 'absolute',
          top: hp('15%'),
          left: wp('70%'),
          width: 4,
          height: 4,
          borderRadius: 3,
          backgroundColor: 'white',
          opacity: 0.6,
          transform: [{ translateY: translate(move3, 0, 7) }],
        }}
      />

      {/* Difuminado */}
      <LinearGradient
        colors={['#3333501a', '#e2e2e2ff']}
        style={{
          position: 'absolute',
          bottom: 0,
          height: hp('17%'),
          width: '110%',
        }}
      />

      {/* Contenido real */}
      <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', paddingHorizontal: wp('2%'), top: wp('10%'), gap: wp('2%') }}>
        <Texts style={{ fontSize: 25, fontWeight: '300', color: 'white' }}>Total Ventas</Texts>
        <View
          style={{
            width: 35,
            height: 25,
            borderRadius: 15,
            marginTop: 3,
            backgroundColor: 'grey',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Texts style={{ color: 'white' }}>hoy</Texts>
        </View>
      </View>

      <Texts style={{ fontSize: wp('15%'), color: 'white', fontWeight: '200', position: 'absolute', paddingHorizontal: wp('2%'), top: wp('17%') }}>
        6,000$
      </Texts>

    </LinearGradient>
  );
}
