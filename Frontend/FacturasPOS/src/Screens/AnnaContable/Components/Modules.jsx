import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated, Easing, FlatList } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

export default function Modules() {

    const data = [
        { id: 1, name: "Nuevos Clientes" },
        { id: 2, name: "Novedades" },
        { id: 3, name: "Recomendaciones" },
    ];

    return (
        <View style={styles.Container}>

            {/* Robot + mensaje */}
            <View style={styles.Header}>
                <MaterialDesignIcons name="robot" size={wp('30%')} color="#555" />
                <Text style={{ fontSize: wp('5%'), color: '#555', fontWeight: '500' }}>En que puedo ayudarte? </Text>
            </View>

            {/* Opciones */}
            <View style={styles.Body}>
                <View style={styles.Row}>
                    <FlatList
                        data={data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <TouchableOpacity style={styles.Module}>
                                <View style={styles.ModuleIconContainer}>
                                    <View style={styles.ModuleIcon}>
                                    </View>
                                </View>
                                <View style={styles.ModuleTextContainer}>
                                    <Text style={styles.ModuleText}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: 'center',
    },

    Header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp('4%'),
        marginTop: wp('5%'),
        marginBottom: wp('2%'),
        padding: wp('2%'),
    },

    Body: {
        gap: wp('4%'),
        backgroundColor: '#fff',
        width: wp('100%'),
        height: hp('66%'),
        padding: wp('2%'),
        borderColor: '#d9d9d9',
    },

    Row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    Module: {
        width: wp('65%'),
        height: hp('16%'),
        marginRight: wp('2%'),
        backgroundColor: '#30923dff',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        borderWidth: 0.5,
        borderColor: '#d9d9d9',
    },

    ModuleIconContainer: {
        width: wp('32%'),
        height: wp('100%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    ModuleTextContainer: {
        width: wp('32%'),
        height: wp('100%'),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    ModuleText: {
        fontSize: wp('4%'),
        color: '#fff',
        fontWeight: '500',
        textAlign: 'left',
    },
    ModuleIcon: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    }
});
