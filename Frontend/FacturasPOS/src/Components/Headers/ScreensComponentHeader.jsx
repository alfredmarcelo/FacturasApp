import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavMenu from '../../Navigation/NavMenu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EvilIcons from '@react-native-vector-icons/evil-icons';
import { useState } from 'react';

export default function ScreensComponentHeader({ color }) {
    const [abrir, setAbrir] = useState();
    return (
        <>
            <NavMenu abrir={abrir} setAbrir={setAbrir} />

            {/* Botón del menú */}
            <View style={[styles.menuBar, { backgroundColor: (color || '#e2e2e2ff') }]}>
                <EvilIcons
                    onPress={() => setAbrir(prev => !prev)}
                    name="navicon"
                    size={wp('12%')}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    menuBar: {
        padding: hp('0.7%'),
    },
});