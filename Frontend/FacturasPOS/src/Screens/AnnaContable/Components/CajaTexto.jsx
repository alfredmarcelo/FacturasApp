
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    ActivityIndicator,
    Platform,
    TouchableOpacity,
    Text,
    ScrollView,
    Keyboard,
} from 'react-native';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';

import AntDesign from '@react-native-vector-icons/ant-design';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Lucide from '@react-native-vector-icons/lucide';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function CajaTexto() {
    const [keyboard, setKeyboard] = useState(false);
    const [abrir, setAbrir] = useState(false);
    const [openText, setOpenText] = useState('');
    const [messages, setMessages] = useState([]); // 👈 AQUÍ SE GUARDAN TODAS LAS "INSTANCIAS"
    const [loading, setLoading] = useState(false);

    const inputWidth = useSharedValue(wp('55%'));
    const hastext = () => openText.length > 0;

    useEffect(() => {
        inputWidth.value = withTiming(hastext() ? wp('82%') : wp('55%'), {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [openText]);

    const animatedInputStyle = useAnimatedStyle(() => ({
        width: inputWidth.value,
    }));

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboard(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboard(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSend = async () => {
        if (!openText.trim()) return;

        // Añadir mensaje del usuario
        setMessages(prev => [...prev, { from: 'user', text: openText }]);

        setLoading(true);

        try {
            const res = await fetch('http://192.168.8.106:8000/auth/anna/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: openText }),
            });

            const data = await res.json();

            console.log(data);
            setMessages(prev => [...prev, { from: 'ai', text: data.output }]);
        } catch (err) {
            setMessages(prev => [...prev, { from: 'ai', text: 'Error al comunicarse con el servidor.' }]);
        }

        setOpenText('');
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : (keyboard ? 50 : 0)}
        >
            {/* INPUT + BOTONES */}
            <View style={styles.footer}>
                <AnimatedTextInput
                    placeholder="Escribe tu texto"
                    style={[styles.WriteTextContainer, animatedInputStyle]}
                    placeholderTextColor="#666"
                    onChangeText={setOpenText}
                    value={openText}
                    multiline={true}
                />

                {hastext() ? (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <TouchableOpacity style={styles.SendButton} onPress={handleSend}>
                            <AntDesign name="send" size={wp('5%')} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <Animated.View style={styles.VoiceButtonContainer} entering={FadeIn} exiting={FadeOut}>
                        <TouchableOpacity style={styles.VoiceButton}>
                            <FontAwesome name="microphone" size={wp('5%')} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.VoiceButton}>
                            <Lucide name="audio-waveform" size={wp('5%')} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.VoiceButton}>
                            <AntDesign name="plus" size={wp('5%')} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    footer: {
        height: hp('10%'),
        backgroundColor: '#e2e2e2ff',
        alignItems: 'center',
        paddingHorizontal: wp('2%'),
        paddingVertical: 10,
        flexDirection: 'row',
    },
    WriteTextContainer: {
        height: hp('7%'),
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#000',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        marginRight: wp('2%'),
    },
    SendButton: {
        backgroundColor: '#b3aaaaff',
        borderRadius: 100,
        padding: 10,
        elevation: 4,
        width: wp('11%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    VoiceButton: {
        backgroundColor: '#b3aaaaff',
        borderRadius: 100,
        padding: wp('3%'),
        elevation: 4,
        width: wp('11%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: wp('1%'),
    },
    VoiceButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
