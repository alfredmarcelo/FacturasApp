import { View, Text, StyleSheet } from 'react-native';
import ScreensComponentHeader from '../../Components/Headers/ScreensComponentHeader';
import EncabezadoScreen from '../../Components/Cards/EncabezadoScreen';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import FlatListReportes from './Components/flatlistReportes';

export default function Reportes() {
    const navigation = useNavigation();
    const [abrir, setAbrir] = useState();
    return (
        <View style={styles.container}>
            <ScreensComponentHeader abrir={abrir} setAbrir={setAbrir} />
            <EncabezadoScreen Datos={() => { }} onPress={() => navigation.navigate('Reportes')} nombre="Reportes" agregar_button_crear={false} />
            <FlatListReportes />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },
});