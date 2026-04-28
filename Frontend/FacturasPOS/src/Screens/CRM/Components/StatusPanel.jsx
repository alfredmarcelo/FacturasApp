import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import Texts from '../../../Components/NativeComponents/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatusPanel({ onStop, onContinue }) {
    const [cambiarcolor, setCambiarcolor] = useState('Encendido');

    const ObtenerClientes = async () => {
        const res = await fetch('http://192.168.8.106:8000/auth/Enviar_a_Frontend', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log(data);
    }

    useEffect(() => {
        ObtenerClientes();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialDesignIcons name="robot" size={wp('15%')} color="#404040" />
                <Texts style={{ position: 'absolute', top: wp('10.5%'), fontSize: wp('5%') }}>...</Texts>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.title}>Atendiendo a 20 clientes</Text>

                <View style={styles.clientesButtonsRow}>
                    <TouchableOpacity
                        style={[
                            styles.headerButton,
                            { backgroundColor: cambiarcolor === 'Apagado' ? 'white' : 'transparent' },
                        ]}
                        onPress={() => setCambiarcolor('Apagado')}
                    >
                        <Texts style={styles.textButton}>Apagado</Texts>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.headerButton,
                            { backgroundColor: cambiarcolor === 'Encendido' ? 'white' : 'transparent' },
                        ]}
                        onPress={() => setCambiarcolor('Encendido')}
                    >
                        <Texts style={styles.textButton}>Encendido</Texts>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: wp('81%'),
        backgroundColor: 'white',
        borderRadius: 15,
        padding: wp('3%'),
        alignSelf: 'center',
        elevation: 4,
        marginVertical: hp('1.5%'),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconContainer: {
        marginRight: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        color: '#333',
        marginBottom: hp('1%'),
    },
    clientesButtonsRow: {
        flexDirection: 'row',
        gap: wp('2%'),
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderRadius: wp('2.5%'),
        padding: wp('1%'),
    },
    headerButton: {
        paddingVertical: hp('0.8%'),
        paddingHorizontal: wp('4%'),
        borderRadius: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: wp('22%'),
    },
    textButton: {
        fontSize: wp('3.5%'),
        fontWeight: '600',
        color: '#333',
    },
});
