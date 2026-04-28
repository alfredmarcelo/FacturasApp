import ComponentsHeader from '../../../Components/Headers/ComponentsHeader';
import { View, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Texts from '../../../Components/NativeComponents/Text';
import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import DatosCotizacion from './DatosCotizacion';
import { useRoute } from '@react-navigation/native';
import { useState } from 'react';
import Camara from '../../../Components/Camara/Camara';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CrearProducto() {
    const route = useRoute();
    // const { TipoProducto, Nombre, Precio, PrecioPorMayor, ITBIS, Descuento } = route.params;
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
    const [codigoBarras, setCodigoBarras] = useState('');
    const [tipoProducto, setTipoProducto] = useState('');
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [precioPorMayor, setPrecioPorMayor] = useState('');
    const [itbis, setItbis] = useState('');
    const [descuento, setDescuento] = useState('');
    const [descripcion, setDescripcion] = useState('');

    // Validar que un valor sea un número válido y positivo
    const isValidNumber = (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0;
    };

    // Validar que un string no esté vacío
    const isNotEmpty = (value) => {
        return value && value.toString().trim().length > 0;
    };

    // Validar todos los campos requeridos
    const validateFields = () => {
        const errors = [];

        // Validar campos obligatorios
        if (!isNotEmpty(nombre)) {
            errors.push('El nombre del producto es requerido');
        }

        if (!isNotEmpty(tipoProducto)) {
            errors.push('El tipo de producto es requerido');
        }

        if (!isNotEmpty(precio)) {
            errors.push('El precio es requerido');
        } else if (!isValidNumber(precio)) {
            errors.push('El precio debe ser un número válido');
        } else if (parseFloat(precio) <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }

        // Validar campos opcionales (solo si tienen valor)
        if (isNotEmpty(precioPorMayor) && !isValidNumber(precioPorMayor)) {
            errors.push('El precio por mayor debe ser un número válido');
        }

        if (isNotEmpty(itbis) && !isValidNumber(itbis)) {
            errors.push('El ITBIS debe ser un número válido');
        }

        return errors;
    };
    const toFloatOrZero = (v) => v === '' || v == null ? 0 : parseFloat(v);
    const agregarProducto = async () => {
        try {
            const ad_id = await AsyncStorage.getItem('ad_id');
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.8.106:8000/auth/productos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ad_id: ad_id,
                    nombre: String(nombre),
                    precio: toFloatOrZero(precio),
                    precio_por_mayor: toFloatOrZero(precioPorMayor),
                    itbis: toFloatOrZero(itbis),
                    descuento: toFloatOrZero(descuento),
                    tipo_producto: String(tipoProducto),
                    codigo_barras: codigoBarras ? String(codigoBarras) : null,
                    tiene_itbis: itbis > 0,
                    activo: true,
                }),
            });
            const data = await response.json();
            console.log(data);
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleAgregarProducto = async () => {
        // Validar campos antes de enviar
        const errors = validateFields();

        if (errors.length > 0) {
            Alert.alert(
                'Campos inválidos',
                errors.join('\n'),
                [{ text: 'Entendido', style: 'default' }]
            );
            return;
        }

        setIsLoading(true);

        try {
            const response = await agregarProducto();

            if (response.ok) {
                Alert.alert(
                    'Éxito',
                    'Producto agregado correctamente',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert(
                    'Error',
                    'No se pudo agregar el producto. Intente nuevamente.',
                    [{ text: 'OK', style: 'default' }]
                );
            }
        } catch (error) {
            Alert.alert(
                'Error de conexión',
                'No se pudo conectar con el servidor. Verifique su conexión.',
                [{ text: 'OK', style: 'default' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenBarcodeScanner = () => {
        setShowBarcodeScanner(true);
    };

    const handleCloseBarcodeScanner = () => {
        setShowBarcodeScanner(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ComponentsHeader onPress={() => navigation.goBack()} nombre="Crear Producto" />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: hp('20%') }}>
                {/* Sección de Captura de Imagen y Código de Barras */}
                <View style={styles.captureSection}>
                    {/* Fila con dos columnas: Foto y Código de Barras */}
                    <View style={styles.captureRow}>
                        {/* Columna: Tomar Foto */}
                        <View style={styles.captureColumn}>
                            <Texts style={styles.Texto}>Tomar foto</Texts>
                            <TouchableOpacity style={styles.AgregarImg}>
                                <Feather name="camera" size={wp('8%')} color="#666" />
                                <Texts style={styles.captureLabel}>Llenado automático</Texts>
                            </TouchableOpacity>
                        </View>

                        {/* Columna: Código de Barras (Opcional) */}
                        <View style={styles.captureColumn}>
                            <Texts style={styles.Texto}>Código de barras <Texts style={styles.optionalText}>(Opcional)</Texts></Texts>
                            <TouchableOpacity
                                style={[styles.AgregarImg, codigoBarras && styles.AgregarImgSuccess]}
                                onPress={handleOpenBarcodeScanner}
                            >
                                <MaterialIcons
                                    name="qr-code-scanner"
                                    size={wp('8%')}
                                    color={codigoBarras ? "#25D366" : "#666"}
                                />
                                <Texts style={[styles.captureLabel, codigoBarras && styles.captureLabelSuccess]}>
                                    {codigoBarras ? codigoBarras : 'Agregar código'}
                                </Texts>
                                <Texts style={styles.optionalHint}>
                                    Para identificar en ventas
                                </Texts>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Datos del Producto */}
                <DatosCotizacion
                    setTipoProducto={setTipoProducto}
                    TipoProducto={tipoProducto}
                    setNombre={setNombre}
                    Nombre={nombre}
                    setPrecio={setPrecio}
                    Precio={precio}
                    setPrecioPorMayor={setPrecioPorMayor}
                    PrecioPorMayor={precioPorMayor}
                    setITBIS={setItbis}
                    ITBIS={itbis}
                    setDescuento={setDescuento}
                    Descuento={descuento}
                    setDescripcion={setDescripcion}
                    descripcion={descripcion}
                />
            </ScrollView>

            {/* Botón de agregar */}
            <View style={styles.ButtonContainer}>
                <TouchableOpacity
                    style={[styles.Button, isLoading && styles.ButtonDisabled]}
                    onPress={handleAgregarProducto}
                    disabled={isLoading}
                >
                    <Texts style={styles.ButtonText}>
                        {isLoading ? 'Agregando...' : 'Agregar Producto'}
                    </Texts>
                </TouchableOpacity>
            </View>

            {/* Modal para escanear código de barras */}
            <Modal
                visible={showBarcodeScanner}
                animationType="slide"
                onRequestClose={handleCloseBarcodeScanner}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={handleCloseBarcodeScanner} style={styles.closeButton}>
                            <Feather name="x" size={wp('6%')} color="#333" />
                        </TouchableOpacity>
                        <Texts style={styles.modalTitle}>Escanear Código de Barras</Texts>
                        <View style={{ width: wp('6%') }} />
                    </View>
                    <Camara />
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },
    scrollContainer: {
        flex: 1,
    },
    captureSection: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('1%'),
    },
    captureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: wp('3%'),
    },
    captureColumn: {
        flex: 1,
    },
    Header: {
        width: wp('100%'),
        height: hp('20%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    AgregarImg: {
        width: '100%',
        height: hp('15%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f5f5f59c',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#8a8484ff',
        borderWidth: wp('0.3%'),
    },
    AgregarImgSuccess: {
        borderColor: '#25D366',
        backgroundColor: '#e8f8ed',
    },
    captureLabel: {
        fontSize: wp('3%'),
        color: '#666',
        marginTop: hp('1%'),
        textAlign: 'center',
    },
    captureLabelSuccess: {
        color: '#25D366',
        fontWeight: '600',
    },
    Texto: {
        fontSize: wp('3.5%'),
        marginBottom: hp('0.5%'),
        color: '#333',
    },
    optionalText: {
        fontSize: wp('2.8%'),
        color: '#888',
        fontStyle: 'italic',
    },
    optionalHint: {
        fontSize: wp('2.5%'),
        color: '#999',
        marginTop: hp('0.5%'),
        textAlign: 'center',
    },
    ButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        width: wp('100%'),
        height: hp('10%'),
    },
    Button: {
        width: wp('90%'),
        height: hp('8%'),
        borderRadius: wp('2%'),
        backgroundColor: '#25D366FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ButtonText: {
        fontSize: wp('4%'),
        color: '#fff',
    },
    ButtonDisabled: {
        backgroundColor: '#a8a8a8',
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('2%'),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: wp('2%'),
    },
});