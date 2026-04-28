import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import ScreensComponentHeader from '../../Components/Headers/ScreensComponentHeader';
import EncabezadoScreen from '../../Components/Cards/EncabezadoScreen';
import { useNavigation } from '@react-navigation/native';
import FlatlistCotizaciones from '../../Components/Flatlist/FlatlistCotizaciones';
import PanelHeader from './Components/PanelHeader';

export default function FrontPanelCotizaciones() {
    const navigation = useNavigation();
    const [abrir, setAbrir] = useState();
    const [data, setData] = useState([]);
    return (
        <View style={styles.container}>
            <ScreensComponentHeader abrir={abrir} setAbrir={setAbrir} />
            <EncabezadoScreen Datos={() => { }} onPress={() => navigation.navigate('CrearCotizacion')} nombre="Cotizaciones" />
            <View style={styles.facturasContainer}>
                <PanelHeader data={data} />
                <FlatlistCotizaciones nombre={'Cotizaciones'} setData={setData} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',

    },
    facturasContainer: {
        flex: 1,
        marginTop: hp('1%'),
    },
});