import { View, FlatList, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Texts from '../../../Components/NativeComponents/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function ClientesCambiar({ DatosCliente, setShowClientesCambiar, style, styleContainer, horizontal = true, setRefrescar }) {

    const [clientesBackend, setClientesBackend] = useState([]);

    const fetchClientes = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const response = await fetch('http://192.168.8.106:8000/auth/GetClientes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            setClientesBackend(data.clientes || []);

        } catch (error) {
            console.log("ERROR CLIENTES:", error);
        }
    };

    useEffect(() => {
        fetchClientes(); // carga una sola vez
    }, []);

    const handleSelect = (item) => {
        DatosCliente(item);
        setShowClientesCambiar(false);
    };

    // --- Estilos ---
    const containerStyle = {
        flexDirection: "row",
        paddingVertical: hp("1%"),
    };

    const cardStyle = {
        width: wp("32%"),
        height: hp("14%"),
        marginRight: wp('2%'),
        borderRadius: wp("3%"),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: wp("3%"),
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: wp("1.5%"),
    };

    const nameStyle = {
        fontSize: wp("3.5%"),
        color: "#333",
        textAlign: "center",
        marginTop: hp("0.5%"),
    };

    const rncStyle = {
        fontSize: wp("3%"),
        color: "#777",
        marginTop: hp("0.5%"),
        textAlign: "center",
    };

    const avatarStyle = {
        width: wp("12%"),
        height: wp("12%"),
        backgroundColor: "grey",
        borderRadius: wp("10%"),
        marginBottom: hp("0.1%"),
    };

    return (
        <View style={[containerStyle, style]}>
            {/* LISTA DE CLIENTES */}
            <FlatList
                data={clientesBackend}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                // ListHeaderComponent={
                //   <TouchableOpacity style={cardStyle} onPress={() => handleSelectAll()}>
                //     <Texts
                //       style={{
                //         fontSize: wp("5%"),
                //         fontWeight: "500",
                //         color: "#444",
                //         textAlign: "center",
                //       }}
                //     >
                //       Todos
                //     </Texts>
                //   </TouchableOpacity>
                // }
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => (handleSelect(item), setRefrescar(true))}
                            style={[
                                cardStyle,
                                styleContainer
                            ]}
                        >
                            <View style={avatarStyle} />
                            <Texts style={nameStyle}>{item.nombre}</Texts>
                            <Texts style={rncStyle}>{item.cedula_rnc}</Texts>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}
