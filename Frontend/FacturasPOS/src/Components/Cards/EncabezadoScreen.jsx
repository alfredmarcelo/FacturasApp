import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import Lucide from '@react-native-vector-icons/lucide';
import Texts from '../NativeComponents/Text';

export default function EncabezadoScreen({ Datos, nombre, onPress, agregar_button = false, agregar_button_crear = true }) {
    return (
        <View style={styles.headerSection}>
            <View style={styles.headerRow}>
                <Texts style={styles.headerTitle}>{nombre}</Texts>

                {agregar_button_crear && <View style={styles.headerButtonsRow}>
                    {/* Crear */}
                    <View style={styles.iconColumn}>
                        <Texts style={styles.iconLabel}>Crear</Texts>
                        <TouchableOpacity
                            style={[styles.circleButton]}
                            onPress={onPress}
                        >
                            <Feather name="plus" size={wp('6%')} />
                        </TouchableOpacity>
                    </View>


                    {agregar_button && <View style={styles.iconColumn}>
                        <Texts style={styles.iconLabel}>Agregar</Texts>
                        <TouchableOpacity style={styles.circleButton}>
                            <Lucide name="file-pen" size={wp('5%')} />
                        </TouchableOpacity>
                    </View>}
                </View>}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({

    headerSection: {
        flexShrink: 0,
        backgroundColor: '#e2e2e2ff',
        paddingBottom: hp('1.5%'),
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
    },

    headerTitle: {
        fontSize: wp('9%'), // 38 aproximado
    },

    headerButtonsRow: {
        flexDirection: 'row',
        gap: wp('5%'),
    },

    iconColumn: {
        alignItems: 'center',
    },

    iconLabel: {
        fontSize: wp('2.8%'),
    },
    circleButton: {
        width: wp('11%'),
        height: wp('11%'),
        borderRadius: wp('20%'),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        marginTop: hp('0.5%'),
    },
});
