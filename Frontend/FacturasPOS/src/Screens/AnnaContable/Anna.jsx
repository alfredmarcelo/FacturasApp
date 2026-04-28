import React, { useState, useEffect, useRef } from 'react';
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
    Image,
} from 'react-native';

import NavMenu from '../../Navigation/NavMenu';
import Modules from './Components/Modules';
import ScreensComponentHeader from '../../Components/Headers/ScreensComponentHeader';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';

import AntDesign from '@react-native-vector-icons/ant-design';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Lucide from '@react-native-vector-icons/lucide';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Anna() {
    const [keyboard, setKeyboard] = useState(false);
    const [abrir, setAbrir] = useState(false);
    const [openText, setOpenText] = useState('');
    const [messages, setMessages] = useState([]); // 👈 AQUÍ SE GUARDAN TODAS LAS "INSTANCIAS"
    const [loading, setLoading] = useState(false);
    const [markdown, setMarkdown] = useState('');
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
        setOpenText('');
        // Añadir mensaje del usuario
        setMessages(prev => [...prev, { from: 'user', text: openText }]);

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch('http://192.168.8.106:8000/auth/anna/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message: openText }),
            });

            const data = await res.json();

            console.log(data);
            setMessages(prev => [...prev, { from: 'ai', text: data.output }]);
        } catch (err) {
            console.log(err);
            setMessages(prev => [...prev, { from: 'ai', text: 'Error al comunicarse con el servidor.' }]);
        }
        setLoading(false);
    };

    const scrollViewRef = useRef();
    const [documents, setDocuments] = useState(false);

    const [image, setImage] = useState(null);

    const openGallery = () => {
        launchImageLibrary(
            {
                mediaType: 'mixed', // 'photo', 'video' o 'mixed'
                selectionLimit: 1, // 1 = un solo archivo
            },
            (response) => {
                if (response.didCancel) {
                    console.log('Usuario canceló');
                } else if (response.errorCode) {
                    console.log('Error: ', response.errorMessage);
                } else {
                    console.log('Archivo seleccionado: ', response.assets[0].uri);
                    setImage(response.assets[0]);
                }
            }
        );
    };

    return (
        <>
            {/* <NavMenu /> */}
            {/* <ScreensComponentHeader /> */}
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : (keyboard ? 50 : 0)}
            >
                {/* CUERPO DEL CHAT */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.body}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    {messages.length > 0 ? <ScrollView>
                        {messages.map((msg, index) => (
                            <View
                                key={index}
                                style={{
                                    padding: wp('5%'),
                                    width: wp('100%'),
                                    alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: msg.from === 'user' ? '#dce6ff' : '#ffffff',
                                        padding: wp('3%'),
                                        borderRadius: wp('2%'),
                                        maxWidth: '85%',
                                    }}
                                >
                                    {msg.from === 'ai' ? (
                                        <Markdown style={markdownStyles}>
                                            {msg.text}
                                        </Markdown>
                                    ) : (
                                        <Text>{msg.text}</Text>
                                    )}
                                </View>
                            </View>
                        ))}

                        {/* LOADING CUANDO ESPERA RESPUESTA */}
                        {loading && (
                            <View style={{ padding: wp('5%'), alignItems: 'flex-start' }}>
                                <ActivityIndicator size="small" />
                            </View>
                        )}
                    </ScrollView> : <Modules />}
                </ScrollView>

                {/* INPUT + BOTONES */}
                <View style={styles.footer}>
                    {image && (
                        <View style={styles.ImageContainer}>
                            <Image source={{ uri: image.uri }} style={styles.Image} />
                        </View>
                    )}
                    <AnimatedTextInput
                        placeholder="Escribe tu texto"
                        style={[styles.WriteTextContainer, animatedInputStyle]}
                        placeholderTextColor="#666"
                        onChangeText={setOpenText}
                        value={openText}
                        multiline={true}
                    />
                    {documents && (
                        <Animated.View style={styles.documents}>
                            <TouchableOpacity style={styles.documentButton} onPress={openGallery}>
                                <Text style={{ color: 'white' }}>Agregar imagen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.documentButton}>
                                <Text style={{ color: 'white' }}>Agregar archivo</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    {hastext() ? (
                        <Animated.View entering={FadeIn} exiting={FadeOut}>
                            <TouchableOpacity style={styles.SendButton} onPress={handleSend} disabled={loading}>
                                <AntDesign name="send" size={wp('5%')} color={loading ? '#ccc' : 'white'} />
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
                            <TouchableOpacity style={styles.VoiceButton} onPress={!documents ? () => setDocuments(true) : () => setDocuments(false)}>
                                <AntDesign name="plus" size={wp('5%')} color="white" />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
            </KeyboardAvoidingView >
        </>
    );
}
const markdownStyles = {
    body: {
        color: '#000',
        fontSize: 13.5,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginVertical: 8,
    },
    thead: {
        backgroundColor: '#f0f0f0',
    },
    tr: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    th: {
        padding: 6,
        fontWeight: 'bold',
    },
    td: {
        padding: 6,
    },
    code_block: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
        fontFamily: 'Courier',
    },
    blockquote: {
        backgroundColor: '#f0f0f0',
        borderLeftColor: '#ccc',
        borderLeftWidth: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    paragraph: {
        marginBottom: 8,
    },
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },
    body: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },
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
    documents: {
        width: wp('50%'),
        height: hp('20%'),
        alignItems: 'center',
        justifyContent: 'center',
        bottom: hp('10%'),
        right: wp('0%'),
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        gap: wp('5%'),
    },
    documentButton: {
        backgroundColor: 'green',
        borderRadius: 10,
        padding: wp('2%'),
        elevation: 4,
        width: wp('40%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageContainer: {
        top: hp('0.4%'),
        paddingHorizontal: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    Image: {
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp('2%'),
    }
});
