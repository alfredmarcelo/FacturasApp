import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Texts from '../NativeComponents/Text'; // Asumo este componente

import MaterialIcons from '@react-native-vector-icons/material-icons';
import Feather from '@react-native-vector-icons/feather';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function FlatlistCotizaciones({ nombre, setData }) {

    const [datacotizaciones, setDatacotizaciones] = useState([]);
    const [selectedCotizacion, setSelectedCotizacion] = useState(null);

    const obtenercotizaciones = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch('http://192.168.8.106:8000/auth/obtenerCotizaciones', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.length === 0) {
                console.log('No hay cotizaciones');
                setDatacotizaciones([]);
            } else {
                setDatacotizaciones(data.obtener_cotizaciones);
                console.log('Cotizaciones obtenidas:', data.obtener_cotizaciones[0].estado);
            }
        } catch (error) {
            console.error('Error al obtener cotizaciones:', error);
        }
    };

    const pagadas = datacotizaciones.filter(item => item.estado === 'pagada').length;
    const pendientes = datacotizaciones.filter(item => item.estado === 'pendiente').length;
    const vencidas = datacotizaciones.filter(item => item.estado === 'vencida').length;
    const anuladas = datacotizaciones.filter(item => item.estado === 'anulada').length;
    const fecha = new Date();

    useEffect(() => {
        obtenercotizaciones();
    }, []);

    useEffect(() => {
        setData([pagadas, pendientes, vencidas, anuladas]);
    }, [datacotizaciones, setData]);

    const getStatusStyle = (estado) => {
        switch (estado.toLowerCase()) {
            case 'pagada': return styles.statusPagada;
            case 'pendiente': return styles.statusPendiente;
            case 'vencida': return styles.statusVencida;
            case 'anulada': return styles.statusAnulada;
            default: return styles.statusDefault;
        }
    };
    const NohayFacturas = () => {
        return (
            <View style={styles.noHayFacturas}>
                <Texts>No hay cotizaciones</Texts>
            </View>
        );
    };

    const deleteCotizacion = async () => {
        if (!selectedCotizacion) {
            Alert.alert('Aviso', 'Selecciona una cotización primero (mantén presionado)');
            return;
        }

        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de eliminar la cotización #${selectedCotizacion.id}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            const res = await fetch(`http://192.168.8.106:8000/auth/EliminarCotizacion/${selectedCotizacion.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                            });

                            if (res.ok) {
                                // Eliminar del estado local
                                setDatacotizaciones(prev => prev.filter(c => c.id !== selectedCotizacion.id));
                                setSelectedCotizacion(null);
                                Alert.alert('Éxito', 'Cotización eliminada correctamente');
                            } else {
                                Alert.alert('Error', 'No se pudo eliminar la cotización');
                            }
                        } catch (error) {
                            console.log(error);
                            Alert.alert('Error', 'Error de conexión');
                        }
                    },
                },
            ]
        );
    };

    const handleLongPress = (item) => {
        setSelectedCotizacion(item);
    };

    const handlePress = () => {
        setSelectedCotizacion(null);
    };

    const formatearMoneda = (valor) => {
        const numero = Number(valor) || 0;
        return numero.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.card,
                { borderLeftColor: getStatusStyle(item.estado).backgroundColor },
                selectedCotizacion?.id === item.id && { borderWidth: 2, borderColor: '#e53935', backgroundColor: '#fff5f5' }
            ]}
            onLongPress={() => handleLongPress(item)}
            onPress={handlePress}
            delayLongPress={300}
        >
            {/* Columna Izquierda: Cliente, ID, Vendedor */}
            <View style={styles.cardLeft}>
                <View style={styles.cardInfo}>
                    <Texts style={styles.clientText}>{item.cliente}</Texts>
                    <Texts style={styles.detailText}>ID: #{item.id} | NCF: {item.ncf}</Texts>
                    <Texts style={styles.detailText}>Vendedor: {item.vendedor}</Texts>
                </View>
            </View>

            {/* Columna Derecha: Total, Fecha, Estado y Acción */}
            <View style={styles.cardRight}>

                {/* Bloque Financiero y Fecha */}
                <View style={styles.financialBlock}>
                    <Texts style={styles.totalText}>RD$ {formatearMoneda(item.total)}</Texts>
                    <Texts style={styles.dateText}>{item.fecha}</Texts>
                </View>

                {/* Bloque de Estado y Acción */}
                <View style={styles.statusAndAction}>
                    <View style={[styles.statusBadge, getStatusStyle(item.estado)]}>
                        <Texts style={styles.statusText}>{item.estado.toUpperCase()}</Texts>
                    </View>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#007bff' }]}
                        onPress={() => Alert.alert('Enviar', `Enviar cotización #${item.id}`)}
                    >
                        <Texts style={styles.actionButtonText}>ENVIAR</Texts>
                        <Feather name="send" size={wp("3.5%")} color="white" />
                    </TouchableOpacity>

                    {/* Botón de Acción Rápida (Abonar/Ver) */}
                    {item.estado.toLowerCase() === 'pendiente' && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => Alert.alert('Pago', `Registrar abono de RD$ ${formatearMoneda(item.pendiente)}`)}
                        >
                            <Texts style={styles.actionButtonText}>PAGAR</Texts>
                            <MaterialIcons name="payment" size={wp("4%")} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.Container}>
            {/* ... HEADER (Se deja el header como estaba, pero se adapta el nombre) ... */}
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.headerbutton} onPress={deleteCotizacion}>
                        <MaterialIcons name="delete-outline" size={wp("6%")} color={selectedCotizacion ? "#e53935" : "#555"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerbutton}>
                        <MaterialIcons name="search" size={wp("6%")} color="#000000ff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerRight}>
                    <Texts style={{ fontSize: wp("4.5%") }}>{nombre}</Texts>
                </View>
            </View>
            {/* -------- LISTA -------- */}
            <FlatList
                data={datacotizaciones}
                emptyComponent={NohayFacturas}
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e2e2e2ff',
    },

    /* ---------------- HEADER (Estilos adaptados del original) ---------------- */
    headerContainer: {
        width: wp("100%"),
        height: hp("7%"),
        backgroundColor: "transparent",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerLeft: {
        width: wp("45%"),
        flexDirection: "row",
        justifyContent: 'flex-start',
        paddingLeft: wp("5%"),
        alignItems: "center",
        gap: wp("2%"),
    },
    headerRight: {
        width: wp("45%"),
        height: "100%",
        backgroundColor: "white",
        borderBottomLeftRadius: wp("25%"),
        borderTopRightRadius: wp("3%"),
        elevation: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    headerbutton: {
        width: wp("11%"),
        height: hp("5%"),
        borderRadius: wp("6%"),
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    /* ---------------- LISTA ---------------- */
    flatList: {
        width: wp("100%"),
    },
    flatListContent: {
        paddingHorizontal: wp("2.5%"),
        paddingBottom: hp("2%"),
    },

    /* ---------------- CARDS (Estilos de Factura) ---------------- */
    card: {
        backgroundColor: "#ffffffff",
        minHeight: hp("12%"),
        borderRadius: wp("3%"),
        marginTop: hp("1.5%"),
        flexDirection: "row",
        justifyContent: 'space-between',
        elevation: 3,
        overflow: 'hidden',
        borderLeftWidth: 0, // Indicador de estado de pago
        paddingHorizontal: wp('2%'),
    },

    // Columna Izquierda (Cliente, RNC, Vendedor)
    cardLeft: {
        flexDirection: "row",
        alignItems: "center",
        width: wp("50%"),
    },
    PhotoContainer: {
        width: wp("12%"),
        height: wp("12%"),
        borderRadius: wp("50%"),
        backgroundColor: "#e2e2e2ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: wp("3%"),
    },
    cardInfo: {
        justifyContent: 'center',
        gap: hp('0.2%'),
    },
    clientText: {
        fontSize: wp("4.3%"),
        fontWeight: 'bold',
        color: '#333',
    },
    detailText: {
        fontSize: wp("3.2%"),
        color: '#666',
    },

    // Columna Derecha (Totales, Fecha, Estado y Acción)
    cardRight: {
        width: wp("40%"),
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingVertical: hp("1%"),
    },
    financialBlock: {
        alignItems: 'flex-end',
        marginBottom: hp('0.5%'),
    },
    totalText: {
        fontSize: wp("5%"),
        color: '#000000ff', // Azul para el total
    },
    dateText: {
        fontSize: wp("3%"),
        color: '#00000069',
    },
    statusAndAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
    },
    // Estado (Badge)
    statusBadge: {
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 5,
    },
    statusText: {
        fontSize: wp("3%"),
        fontWeight: 'bold',
        color: 'white',
    },
    statusPagada: { backgroundColor: '#28a745' },     // Verde
    statusPendiente: { backgroundColor: '#ffc107' },  // Ámbar
    statusVencida: { backgroundColor: '#dc3545' },    // Rojo
    statusAnulada: { backgroundColor: '#6c757d' },    // Gris
    statusDefault: { backgroundColor: '#007bff' },

    // Botón de Acción (PAGAR/ABONAR)
    actionButton: {
        flexDirection: 'row',
        backgroundColor: '#17a2b8', // Color Turquesa para Abono/Pago
        paddingVertical: hp("0.5%"),
        paddingHorizontal: wp("2%"),
        borderRadius: 5,
        alignItems: 'center',
        gap: 3,
    },
    actionButtonText: {
        color: 'white',
        fontSize: wp("3%"),
        fontWeight: '700',
    },
});