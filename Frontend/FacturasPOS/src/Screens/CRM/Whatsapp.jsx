import { View, StyleSheet } from "react-native";
import EncabezadoScreen from '../../Components/Cards/EncabezadoScreen';
import ScreensComponentHeader from "../../Components/Headers/ScreensComponentHeader";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import Flatlist from "./Components/Flatlist";
import StatusPanel from './Components/StatusPanel';

export default function Whatsapp() {
    const navigation = useNavigation();
    const [abrir, setAbrir] = useState(false);

    const clientes = [{
        nombre: "Cliente 1",
        cedula_rnc: "123456789",
        telefono: "123456789",
        email: "cliente1@gmail.com",
        status: "Activo",
        cantidad_facturas: 1,
    },
    {
        nombre: "Cliente 2",
        cedula_rnc: "123456789",
        telefono: "123456789",
        email: "cliente2@gmail.com",
        status: "Activo",
        cantidad_facturas: 1,
    },
    ]
    return (
        <View style={styles.container}>
            <ScreensComponentHeader abrir={abrir} setAbrir={setAbrir} />
            <EncabezadoScreen
                navigation={navigation}
                Datos={() => { }}
                onPress={() => { }}
                nombre="Whatsapp"
                agregar_button={false}
                agregar_button_crear={false}
            />
            <StatusPanel
                onStop={() => console.log('Stop pressed')}
                onContinue={() => console.log('Continue pressed')}
            />
            <Flatlist clientes={clientes} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },
});
