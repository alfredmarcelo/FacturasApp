import { View, Animated, Easing, Image, FlatList } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef } from 'react';
import Clientes from '../../../Components/Flatlist/FlatlistClientes'

export default function BodyHeader({ total_hoy, total_ayer }) {

    // Función para calcular tamaño de fuente dinámico según longitud del monto
    const getDynamicFontSize = (value) => {
        const length = String(value || 0).length;
        if (length <= 6) return wp('15%');
        if (length <= 8) return wp('12%');
        if (length <= 10) return wp('10%');
        if (length <= 12) return wp('8%');
        return wp('6%');
    };

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

    const vendedores = [
        { id: 1, nombre: 'Juan', ventas: 100 },
        { id: 2, nombre: 'Maria', ventas: 200 },
        { id: 3, nombre: 'Pedro', ventas: 300 },

    ]

    return (
        <LinearGradient
            colors={['#87CEFA', '#d3d3d3ff']} // Cielo azul → celeste (día)
            style={{
                width: wp('100%'),
                height: hp('40%'),
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >

            {/* ☀️ Sol */}
            <Animated.View
                style={{
                    position: 'absolute',
                    top: hp('1%'),
                    right: wp('5%'),
                    width: 55,
                    height: 55,
                    borderRadius: 40,
                    backgroundColor: '#ffea02ff', // Amarillo suave
                    shadowColor: '#fff9c4',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 20, // Glow solar
                    elevation: 8,
                    transform: [
                        { translateY: moonMove.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) }
                    ]
                }}
            />

            {/* ☁️ Nubes pequeñas animadas */}
            <Animated.View
                style={{
                    position: 'absolute',
                    top: hp('12%'),
                    left: wp('10%'),
                    width: 14,
                    height: 8,
                    borderRadius: 10,
                    backgroundColor: '#ffffffaa',
                    opacity: 0.9,
                    transform: [{ translateY: translate(move1, 0, 5) }],
                }}
            />

            <Animated.View
                style={{
                    position: 'absolute',
                    top: hp('6%'),
                    left: wp('40%'),
                    width: 18,
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: '#ffffff99',
                    opacity: 0.9,
                    transform: [{ translateY: translate(move2, 0, 8) }],
                }}
            />

            <Animated.View
                style={{
                    position: 'absolute',
                    top: hp('15%'),
                    left: wp('70%'),
                    width: 12,
                    height: 7,
                    borderRadius: 8,
                    backgroundColor: '#ffffff88',
                    opacity: 0.85,
                    transform: [{ translateY: translate(move3, 0, 6) }],
                }}
            />

            {/* Difuminado inferior – luz brillante */}
            <LinearGradient
                colors={['#ffffff00', '#e2e2e2ff']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    height: hp('17%'),
                    width: '110%',
                }}
            />

            {/* Texto */}
            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', paddingHorizontal: wp('6%'), top: wp('10%'), gap: wp('2%') }}>
                <Texts style={{ fontSize: wp('7%'), fontWeight: '300', color: '#000000ff' }}>
                    Total Ventas
                </Texts>

                <View
                    style={{
                        width: 35,
                        height: 25,
                        borderRadius: 15,
                        marginTop: 3,
                        backgroundColor: '#000000ff',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Texts style={{ color: 'white', fontSize: wp('3%') }}>HOY</Texts>
                </View>
                <Texts
                    style={{
                        fontSize: getDynamicFontSize(total_hoy),
                        color: '#000000ff',
                        fontWeight: '300',
                        position: 'absolute',
                        paddingHorizontal: wp('6%'),
                        top: wp('8%')
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    ${total_hoy}
                </Texts>
                <View style={{ position: 'absolute', top: wp('1%'), left: wp('60%'), width: 0.2, height: 95, borderRadius: 1, backgroundColor: 'white' }} />
                <Texts style={{ position: 'absolute', top: wp('13%'), left: wp('65%'), fontSize: wp('3%'), fontWeight: '300', color: 'black' }}>
                    Ventas ayer
                </Texts>
                <Texts
                    style={{
                        fontSize: wp('7%'),
                        color: '#000000ff',
                        fontWeight: '200',
                        position: 'absolute',
                        paddingHorizontal: wp('65%'),
                        top: wp('16%'),
                    }}
                >
                    ${total_ayer ? total_ayer : 0}
                </Texts>
            </View>

        </LinearGradient>

    );
}
