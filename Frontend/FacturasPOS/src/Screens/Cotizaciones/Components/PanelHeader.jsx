import React from 'react'
import { View, StyleSheet } from 'react-native'
import Texts from '../../../Components//NativeComponents/Text'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function PanelHeader({ data }) {
    // data is expected to be an array: [pagadas, pendientes, vencidas, anuladas]

    // Definimos las estadísticas con colores sutiles para los badges
    const stats = [
        { name: 'Pagadas', count: data[0] || '0', color: '#28a745' },     // Verde (Pagada)
        { name: 'Pendientes', count: data[1] || '0', color: '#ffc107' },  // Ámbar (Pendiente)
        { name: 'Vencidas', count: data[2] || '0', color: '#dc3545' },    // Rojo (Vencida)
        { name: 'Anuladas', count: data[3] || '0', color: '#6c757d' },    // Gris (Anulada)
    ];

    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <View style={styles.container}>
            {/* Título */}
            {/* Contenedor principal de estadísticas */}
            <View style={styles.statsContainer}>
                {stats.map((stat) => (
                    <View key={stat.name} style={styles.statCard}>
                        {/* Nombre de la Categoría */}
                        <Texts style={styles.statName}>{stat.name}</Texts>

                        {/* Conteo en un badge de color */}
                        <View style={[styles.countBadge, { backgroundColor: stat.color }]}>
                            <Texts style={styles.countText}>{stat.count}</Texts>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('16%'), // Altura optimizada
        alignItems: 'center',

    },
    titleContainer: {
        width: wp('90%'),
        marginBottom: hp('1%'),
        paddingLeft: wp('2.5%'),
    },
    titleText: {
        fontSize: wp('4.5%'),
        fontWeight: '600', // Seminegrita, no exagerada
        color: '#333',
    },
    statsContainer: {
        width: wp('95%'),
        height: hp('14%'),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: wp('2%'),
        // Sombra suave para un efecto de tarjeta (no exagerado)
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        paddingHorizontal: wp('1%'),
    },
    statCard: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingHorizontal: wp('1%'),
    },
    statName: {
        fontSize: wp('3.2%'),
        color: '#666', // Color de texto de detalle
        marginBottom: hp('0.5%'),
    },
    countBadge: {
        minWidth: wp('10%'),
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('1%'),
        borderRadius: 20, // Forma de píldora
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    countText: {
        fontSize: wp('3.8%'),
        fontWeight: '700', // Negrita necesaria para destacar el conteo
        color: 'white', // Texto blanco sobre el color de estado
    },
});