import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Login() {

    const navigation = useNavigation();

    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

    const fetchLogin = async () => {
        try {
            const response = await fetch('http://192.168.8.106:8000/login/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: correo,
                    password: contraseña,
                }),
            });
            const data = await response.json();
            if (data.token) {
                console.log(data);
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('id', String(data.usuario.id));
                await AsyncStorage.setItem('ad_id', String(data.usuario.ad_id));
                await AsyncStorage.setItem('ad_nombre', String(data.usuario.ad_nombre));
                await AsyncStorage.setItem('ad_apellido', String(data.usuario.ad_apellido));
                await AsyncStorage.setItem('ad_rnc', String(data.usuario.ad_rnc));
                navigation.navigate('FrontPanel');
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <View>
            <Text>Login</Text>
            <TextInput placeholder='Correo' placeholderTextColor={'#000'} onChangeText={setCorreo} style={{ color: '#000' }} />
            <TextInput placeholder='Contraseña' placeholderTextColor={'#000'} onChangeText={setContraseña} style={{ color: '#000' }} />
            <TouchableOpacity onPress={fetchLogin}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
}