import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';

export default function MetodoPago({ setgetitems, setshowmetodoPago }) {
    const data = [
        { id: '1', label: 'Efectivo', value: 'Efectivo' },
        { id: '2', label: 'Transferencia', value: 'Transferencia' },
        { id: '3', label: 'Tarjeta', value: 'Tarjeta' },
    ]
    return (
        <View style={style.Container}>
            <View style={style.header}>
                <Texts>Metodo Pago</Texts>
            </View>
            <View style={style.Body}>
                <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (
                    <TouchableOpacity style={style.content} onPress={() => [setgetitems(item.value), setshowmetodoPago(false)]}>
                        <Texts>{item.label}</Texts>
                    </TouchableOpacity>
                )} />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    Container: {
        width: '100%',
        height: '100%',
    },
    Body: {
        width: '100%',
        height: '100%'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    content: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
});
