import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ScreensComponentHeader from '../../Components/Headers/ScreensComponentHeader';
import EncabezadoScreen from '../../Components/Cards/EncabezadoScreen';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import ClientesFlatlist from './Components/Clientesflatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Clientes() {

    const [clientes, setClientes] = useState([]);

    const obtenerclientes = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch('http://192.168.8.106:8000/auth/ObtenerClientesOrganizado', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log(data);
            setClientes(data.clientes);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    useEffect(() => {
        obtenerclientes();
    }, []);

    const navigation = useNavigation();
    const [abrir, setAbrir] = useState();
    return (
        <View style={styles.container}>
            <ScreensComponentHeader abrir={abrir} setAbrir={setAbrir} />
            <EncabezadoScreen Datos={() => { }} onPress={() => navigation.navigate('CrearCliente')} nombre="Clientes" />
            <ClientesFlatlist clientes={clientes} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },
});
