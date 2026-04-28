import { View, Text, StyleSheet } from 'react-native';
import ScreensComponentHeader from '../../Components/Headers/ScreensComponentHeader';
import EncabezadoScreen from '../../Components/Cards/EncabezadoScreen';
import { useState } from 'react';
import ProductosFlatlist from './Components/ProductosFlatlist';
import { useNavigation } from '@react-navigation/native';

export default function Productos() {

    const [TipoProducto, setTipoProducto] = useState('');
    const [Nombre, setNombre] = useState('');
    const [Precio, setPrecio] = useState('');
    const [PrecioPorMayor, setPrecioPorMayor] = useState('');
    const [ITBIS, setITBIS] = useState('');
    const [Descuento, setDescuento] = useState('');


    const navigation = useNavigation();
    const [abrir, setAbrir] = useState();
    return (
        <View style={styles.container}>
            <ScreensComponentHeader abrir={abrir} setAbrir={setAbrir} />
            <EncabezadoScreen Datos={() => { }} onPress={() => navigation.navigate('CrearProducto', { TipoProducto, Nombre, Precio, PrecioPorMayor, ITBIS, Descuento })} nombre="Productos" />
            <ProductosFlatlist />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },
});
