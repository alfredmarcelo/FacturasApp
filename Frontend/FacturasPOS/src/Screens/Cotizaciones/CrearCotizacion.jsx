import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ComponentsHeader from '../../Components/Headers/ComponentsHeader';
import { useNavigation } from '@react-navigation/native';
import ClienteCard from '../../Components/Cards/ClientesCard';
import DatosCotizacion from '../../Components/Cards/DatosCotizacion';
import Pop from '../../Components/Cards/Pop';
import { useState } from 'react';
import Productos from '../../Screens/Facturas/Productos';
import Texts from '../../Components/NativeComponents/Text';
import FechaSelector from '../../Components/NativeComponents/Fecha';
import FechaLimite from '../../Components/NativeComponents/FechaLimite';
import TipoNCF from '../../Screens/Facturas/Components/TipoNCF';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// *** IMPORT RESPONSIVE SCREEN ***
import { widthPercentageToDP as wp, heightPercentageToDP as hp }
    from 'react-native-responsive-screen';

/* ---------- Paleta y Tipografía ---------- */
const COLORS = {
    primary: '#2563EB',         // Azul vibrante
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

export default function CrearCotizacion() {
    const navigation = useNavigation();
    const [showFecha, setShowFecha] = useState(false);
    const [getFecha, setgetFecha] = useState();
    const [showFechaLimite, setShowFechaLimite] = useState(false);
    const [getFechaLimite, setgetFechaLimite] = useState();
    const [subtotalArray, setSubtotalArray] = useState([]);
    const [Descuento, setDescuento] = useState(0);
    const [getnombre, setgetnombre] = useState();
    const [getrnc, setgetrnc] = useState();


    const validarDatos = () => {
        const faltantes = [];
        if (!getnombre) faltantes.push('Nombre');
        if (!getrnc) faltantes.push('RNC');
        if (!getFecha) faltantes.push('Fecha');
        if (!getFechaLimite) faltantes.push('Fecha límite');
        if (subtotalArray.length === 0) faltantes.push('Productos');

        if (faltantes.length > 0) {
            Alert.alert('Datos incompletos', `Falta: ${faltantes.join(', ')}`);
            return false;
        }
        return true;
    };

    const EnviarCotizacionCreada = async () => {
        if (!validarDatos()) return;

        try {
            const token = await AsyncStorage.getItem('token');
            const AD_id = await AsyncStorage.getItem('ad_id');

            const response = await fetch('http://192.168.8.106:8000/auth/crearCotizacion/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ad_id: AD_id,
                    nombre: String(getnombre),
                    fecha: String(getFecha),
                    fecha_validez: String(getFechaLimite),
                    rnc_cliente: String(getrnc),
                    subtotal: Number(subtotales),
                    descuento: Number(Descuento),
                    itbis: Number(itbis),
                    total: Number(total),
                    estado: 'pendiente',
                }),
            });
            const data = await response.json();
            if (data.mensaje == 'Cotización creada correctamente') {
                navigation.navigate('CotizacionCreada', {
                    rnc_cliente: data.rnc_cliente,
                    nombre_cliente: data.nombre,
                    fecha: data.fecha,
                    fechaLimite: data.fecha_validez,
                    subtotal: data.subtotal,
                    itbis: data.itbis,
                    total: data.total,
                    descuento: data.descuento,
                    estado: data.estado,
                    productos: subtotalArray,
                });
            } else {
                Alert.alert('Error', 'No se pudo crear la cotización');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const subtotales = subtotalArray.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0,
    );
    const itbis = subtotalArray.reduce(
        (acc, item) => acc + item.precio * item.cantidad * (item.itbis / 100),
        0,
    );
    const total = subtotales + itbis - Number(Descuento);

    return (
        <View style={style.container}>
            <ComponentsHeader onPress={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={{ paddingBottom: hp('12%') }}>
                <View style={style.Body}>
                    <DatosCotizacion
                        setShowFecha={setShowFecha}
                        showFecha={showFecha}
                        setShowFechaLimite={setShowFechaLimite}
                        setDescuento={setDescuento}
                        setgetnombre={setgetnombre}
                        setgetrnc={setgetrnc}
                        getFechaLimite={getFechaLimite}
                        getFecha={getFecha}
                    />

                    <View style={style.Productos}>
                        <Productos setsubtotal={setSubtotalArray} />
                    </View>
                </View>
            </ScrollView>

            {showFecha && (
                <FechaSelector setgetFecha={setgetFecha} setShowFecha={setShowFecha} />
            )}

            {showFechaLimite && (
                <Pop
                    show={showFechaLimite}
                    setShow={setShowFechaLimite}
                    content={
                        <FechaLimite
                            setgetitems={setgetFechaLimite}
                            setShowFechaLimite={setShowFechaLimite}
                        />
                    }
                />
            )}


            {/* Footer con Layout Preservado pero Estilo Mejorado */}
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
                                ${Descuento}
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
                        <Texts style={[style.DatosTotalText, { color: COLORS.primary }]}>${total.toFixed(2)}</Texts>
                    </View>
                </View>

                <TouchableOpacity
                    style={style.Buttons}
                    activeOpacity={0.8}
                    onPress={() => EnviarCotizacionCreada()}
                >
                    <LinearGradient
                        colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                        style={style.GradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Texts style={{ fontSize: wp('4.5%'), color: 'white', fontFamily: FONT.bold }}>
                            Crear Cotizacion
                        </Texts>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },

    Body: {
        // Espacio para el contenido
    },

    Productos: {
        width: wp('100%'),
    },

    /* Footer Styles */
    Footer: {
        width: wp('100%'),
        height: hp('10%'),
        borderTopLeftRadius: wp('5%'),
        borderTopRightRadius: wp('5%'),
        flexDirection: 'row',
        backgroundColor: 'white',
        // Sombra suave
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 15,
        position: 'absolute',
        bottom: 0,
    },

    FooterDatosContainer: {
        width: wp('65%'),
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },

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

    Datos: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    DatosTotal: {
        width: wp('33%'),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: hp('0.5%'),
    },

    Buttons: {
        width: wp('35%'),
        height: '100%',
        borderTopRightRadius: wp('5%'),
        overflow: 'hidden', // Para que el gradiente respete el borde
    },

    GradientButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    DatosBasicosText: {
        fontSize: wp('3.5%'),
        fontFamily: FONT.medium,
        color: COLORS.textSecondary,
    },

    DatosTotalText: {
        fontSize: wp('5.5%'),
        fontFamily: FONT.bold,
    },
})
