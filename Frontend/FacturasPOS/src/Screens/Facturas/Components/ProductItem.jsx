import React, { memo } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';
import Fontawesome from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../../Theme/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProductItem = ({ item, onRemove }) => {
    const total = item.valorUnitario * item.cantidad;
    const itbisValue = item.itbis * item.valorUnitario;
    const itbisPercent = item.itbis * 100;

    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <View style={styles.iconContainer}>
                    <Fontawesome name="box" size={wp('5%')} color={Colors.primary} />
                </View>
                <View style={styles.infoContainer}>
                    <Texts style={styles.name}>{item.nombre}</Texts>
                    <Texts style={styles.details}>
                        Unit: RD$ {item.valorUnitario}
                    </Texts>
                    <Texts style={styles.subDetails}>
                        ITBIS: {itbisValue.toFixed(2)} ({itbisPercent}%)
                    </Texts>
                </View>
            </View>

            <View style={styles.rightContent}>
                <Texts style={styles.price}>
                    {item.cantidad} x RD$ {total.toFixed(2)}
                </Texts>
                <TouchableOpacity
                    onPress={() => onRemove(item.id)}
                    style={styles.deleteButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Fontawesome name="trash" size={wp('5%')} color={Colors.danger} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: wp('3%'),
        padding: wp('4%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.5%'),
        shadowColor: Colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: wp('3%'),
    },
    iconContainer: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    details: {
        fontSize: wp('3.2%'),
        color: Colors.textSecondary,
    },
    subDetails: {
        fontSize: wp('2.8%'),
        color: Colors.textSecondary,
        fontStyle: 'italic'
    },
    rightContent: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: hp('1%'),
        minWidth: wp('25%'),
    },
    price: {
        fontSize: wp('3.8%'),
        fontWeight: '700',
        color: Colors.primary,
    },
    deleteButton: {
        padding: wp('2%'),
        backgroundColor: '#FEE2E2', // Light red
        borderRadius: wp('2%'),
    },
});

export default memo(ProductItem);
