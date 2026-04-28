import React from 'react';
import { View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Empleados() {
    const empleadosOficina = [
        { id: '1', nombre: "Ana", activo: true, img: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: '2', nombre: "Carlos", activo: true, img: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: '3', nombre: "Alfred", activo: false, img: 'https://randomuser.me/api/portraits/men/85.jpg' },
        { id: '4', nombre: "Sofia", activo: true, img: 'https://randomuser.me/api/portraits/women/68.jpg' },
    ];

    const empleadosDelivery = [
        { id: '5', nombre: "Jorge", estado: 'Entregando', activo: true, img: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { id: '6', nombre: "Luis", estado: 'Disponible', activo: true, img: 'https://randomuser.me/api/portraits/men/12.jpg' },
        { id: '7', nombre: "Pedro", estado: 'Disponible', activo: false, img: 'https://randomuser.me/api/portraits/men/3.jpg' },
    ];

    const renderOficinaItem = ({ item }) => (
        <View style={style.card}>
            <View style={style.avatarContainer}>
                <Image source={{ uri: item.img }} style={style.avatar} />
                <View style={[style.statusDot, { backgroundColor: item.activo ? '#4CAF50' : '#BDBDBD' }]} />
            </View>
            <Texts style={style.nameText}>{item.nombre}</Texts>
            <Texts style={style.roleText}>Oficina</Texts>
        </View>
    );

    const renderDeliveryItem = ({ item }) => (
        <View style={style.card}>
            <View style={style.avatarContainer}>
                <Image source={{ uri: item.img }} style={style.avatar} />
                <View style={[style.statusDot, { backgroundColor: item.activo ? '#4CAF50' : '#BDBDBD' }]} />
            </View>
            <Texts style={style.nameText}>{item.nombre}</Texts>

            <View style={style.deliveryStatusContainer}>
                {item.estado === 'Entregando' ? (
                    <MaterialIcons name="moped" size={14} color="#FF9800" />
                ) : (
                    <Ionicons name="checkmark-circle-outline" size={14} color="#4CAF50" />
                )}
                <Texts style={[style.deliveryStatusText, { color: item.estado === 'Entregando' ? '#FF9800' : '#4CAF50' }]}>
                    {item.estado === 'Entregando' ? 'En ruta' : 'Libre'}
                </Texts>
            </View>
        </View>
    );

    return (
        <View style={style.container}>
            <View style={style.section}>
                <Texts style={style.sectionTitle}>En local</Texts>
                <FlatList
                    data={empleadosOficina}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={style.listContent}
                    renderItem={renderOficinaItem}
                    keyExtractor={(item) => item.id}
                />
            </View>

            <View style={style.section}>
                <Texts style={style.sectionTitle}>Delivery</Texts>
                <FlatList
                    data={empleadosDelivery}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={style.listContent}
                    renderItem={renderDeliveryItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        width: wp("100%"),
        paddingTop: hp("2%"),
    },
    section: {
        marginBottom: hp("2%"),
    },
    sectionTitle: {
        fontSize: wp("4.5%"),
        fontWeight: '600',
        color: '#535355',
        marginLeft: wp("5%"),
        marginBottom: hp("1.5%"),
    },
    listContent: {
        paddingHorizontal: wp("1%"),
        paddingVertical: hp("0.5%"),
    },
    card: {
        width: wp("28%"),
        height: hp("15%"),
        backgroundColor: 'white',
        borderRadius: 15,
        marginHorizontal: wp("1.5%"),
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp("2%"),
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: hp("1%"),
    },
    avatar: {
        width: wp("14%"),
        height: wp("14%"),
        borderRadius: wp("7%"),
        backgroundColor: '#f0f0f0',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: 'white',
    },
    nameText: {
        fontSize: wp("3.5%"),
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    roleText: {
        fontSize: wp("3%"),
        color: '#888',
    },
    deliveryStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
    },
    deliveryStatusText: {
        fontSize: wp("2.5%"),
        marginLeft: 4,
        fontWeight: '600',
    }
});
