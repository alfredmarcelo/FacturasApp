import { StyleSheet, View, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


export default function IAcard() {
  const frases = [
    'Puedo generar un resumen de tu negocio',
    'Puedo generar facturas',
    'Puedo darte asesoría contable',
    'Puedo responder preguntas financieras',
  ];

  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % frases.length);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3500); // cada 2.5s cambia el texto

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={style.content}>
      <View style={style.Body}>
        <MaterialDesignIcons name="robot" size={32} color="#404040" />

        <View style={style.textContainer}>
          <Animated.Text style={[style.texto, { opacity: fadeAnim }]}>
            {frases[index]}
          </Animated.Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    width: wp('45%'),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp('2%'),
  },
  Body: {
    width: wp('40%'),
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 10,
    padding: 10,
  },

  textContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  texto: {
    fontSize: 14,
    textAlign: 'center',
    color: '#616060ff',
    paddingHorizontal: 10,
  },
});
