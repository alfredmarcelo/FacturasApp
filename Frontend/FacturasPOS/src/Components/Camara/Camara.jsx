import React, { useRef } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import Texts from '../NativeComponents/Text';
import ToggleCart from '../Flatlist/ProductosSeleccionados';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Camara() {
    const device = useCameraDevice('back')
    const perm = Camera.requestCameraPermission()
    if (!perm) {
        Alert.alert('Permiso denegado', 'Necesitas permiso para usar la camara')
        return
    }

    const [Producto, setProducto] = useState({})
    console.log(Producto.id)

    const ObtenerProductoFetch = async (codigo) => {
        try {
            const token = await AsyncStorage.getItem('token')
            const response = await fetch('http://192.168.8.106:8000/auth/codigodebarras/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    codigo: codigo,
                }),
            })
            const data = await response.json()
            setProducto(data)
        } catch (error) {
            console.log(error)
        }
    }

    const [CodigoScaneado, setCodigoScaneado] = useState([''])
    const ultimoScanRef = useRef(0);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'code-128'],
        onCodeScanned: (code) => {
            const ahora = Date.now();

            if (ahora - ultimoScanRef.current < 2000) return;
            ultimoScanRef.current = ahora;

            Alert.alert('Código escaneado', code[0].value)
            setCodigoScaneado([...CodigoScaneado, code[0].value])
            ObtenerProductoFetch(code[0].value)
        }
    })

    const renderInvoiceItem = ({ item }) => (
        <View style={styles.invoiceItem}>
            <View style={{ flex: 1 }}>
                <Texts style={styles.invoiceName}>{item.nombre}</Texts>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Texts style={styles.invoiceDetails}>
                        {item.cantidad} x ${item.cantidad * item.precio}
                    </Texts>
                    <Texts style={styles.invoiceDetails}>
                        C/U x ${item.precio}
                    </Texts>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.deleteButton}
            >
                <Texts style={styles.deleteText}>X</Texts>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Camera style={styles.Camara} isActive={true} facing="back" device={device} codeScanner={codeScanner} />
            <Image source={require('./image.png')} style={styles.Icon} />
            {Producto ?
                <ToggleCart
                    items={() => { }}
                    onRemoveItem={() => { }}
                    Productos={() => { }}
                    route={() => { }}
                />
                :
                <ToggleCart
                    items={renderInvoiceItem}
                    onRemoveItem={() => { }}
                    Productos={Producto}
                    route={() => { }}
                />
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Camara: {
        width: wp('100%'),
        height: hp('90%'),
    },
    Icon: {
        width: wp('100%'),
        height: hp('25%'),
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 40,
        left: 80,
        color: 'white',
    },
});