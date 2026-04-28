import React, { useState } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
} from 'react-native';
import EvilIcons from '@react-native-vector-icons/evil-icons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import ComponentsHeader from '../../../Components/Headers/ComponentsHeader';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
// Se eliminan imports innecesarios para esta vista de clientes
// import ToggleCart from '../../../Components/Flatlist/ProductosSeleccionados'; 
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Texts from '../../../Components/NativeComponents/Text';
import Pop from '../../../Components/Cards/Pop'; // Componente Pop importado
import AntDesign from '@react-native-vector-icons/ant-design';

const { width, height } = Dimensions.get('window');
const ITEM_MARGIN = 10;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS; // Ajusta el ancho de cada item

export default function ClientesFlatlist({ clientes }) {

    // Se eliminan estados no relacionados con Clientes (e.g., invoiceItems)
    const navigation = useNavigation();

    // --- NUEVA LÓGICA PARA EL POPUP DE CLIENTES ---
    const [showPop, setShowPop] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null); // Estado para almacenar el cliente

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setShowPop(true);
    };

    // --- COMPONENTE AUXILIAR PARA LOS DETALLES DEL POPUP (usando estilos en línea) ---
    const RenderClientDetails = ({ client }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'VIP':
                    return '#C0B000'; // Dorado
                case 'Activo':
                    return '#2E7D32'; // Verde oscuro
                case 'Inactivo':
                    return '#D32F2F'; // Rojo
                default:
                    return '#666';
            }
        };

        return (
            <View style={{
                alignItems: 'center',
                height: hp('60%'),
                borderRadius: 10,
                padding: wp('5%'),
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp('2%'), position: 'absolute', top: hp('1%'), justifyContent: 'space-between', width: wp('70%'), height: hp('4%') }}>
                    <AntDesign name="close" size={24} color="black" onPress={() => setShowPop(false)} />
                    <AntDesign name="edit" size={24} color="black" />
                </View>
                <Image
                    source={{ uri: client.imagenUrl }}
                    style={{
                        width: wp('23%'),
                        height: wp('23%'),
                        borderRadius: wp('12.5%'),
                        marginBottom: hp('2%'),
                        borderWidth: 1,
                        borderColor: '#000',
                    }}
                />
                <Texts numberOfLines={1} style={{
                    fontSize: hp('2.8%'),
                    fontWeight: '900',
                    color: '#222',
                }}>{client.nombre}</Texts>
                <Texts numberOfLines={1} style={{
                    fontSize: hp('2%'),
                    color: '#222',
                }}>{client.cedula_rnc}</Texts>

                <View style={{
                    height: 1,
                    width: '90%',
                    backgroundColor: '#eee',
                    marginVertical: hp('1.5%'),
                }} />

                {/* Detalles */}
                <View style={{ width: '90%', paddingHorizontal: wp('2%') }}>
                    <Texts style={{ fontSize: hp('1.8%'), color: '#555', marginTop: hp('0.1%'), fontWeight: '600' }}>Teléfono:</Texts>
                    <Texts numberOfLines={1} style={{ fontSize: hp('2.1%'), color: '#000', marginBottom: hp('0.5%') }}>{client.telefono}</Texts>

                    <Texts style={{ fontSize: hp('1.8%'), color: '#555', marginTop: hp('0.5%'), fontWeight: '600' }}>Correo:</Texts>
                    <Texts numberOfLines={1} style={{ fontSize: hp('2.1%'), color: '#000', marginBottom: hp('0.5%') }}>{client.email}</Texts>

                    <Texts style={{ fontSize: hp('1.8%'), color: '#555', marginTop: hp('0.5%'), fontWeight: '600' }}>Status:</Texts>
                    <Texts numberOfLines={1} style={{
                        fontSize: hp('2.1%'),
                        fontWeight: 'bold',
                        color: getStatusColor(client.status),
                        marginBottom: hp('1%')
                    }}>
                        {client.status}
                    </Texts>
                    <Texts style={{ fontSize: hp('1.8%'), color: '#555', marginTop: hp('0.5%'), fontWeight: '600' }}>Total Facturas:</Texts>
                    <Texts numberOfLines={1} style={{
                        fontSize: hp('2.1%'),
                        marginBottom: hp('1%')
                    }}>
                        {client.cantidad_facturas}
                    </Texts>
                </View>
                <View style={{ gap: wp('5%'), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: hp('1%') }}>
                    <AntDesign name="phone" size={24} color="black" />
                    <AntDesign name="mail" size={24} color="black" />
                    <MaterialDesignIcons name="invoice-plus" size={24} color="black" />
                </View>
                <TouchableOpacity style={{
                    backgroundColor: '#007bff',
                    paddingVertical: hp('1.5%'),
                    paddingHorizontal: wp('8%'),
                    borderRadius: 10,
                    marginTop: hp('3%'),
                    elevation: 3,
                }}>
                    <Texts style={{ color: 'white', fontWeight: 'bold', fontSize: hp('2%') }}>Ver Historial</Texts>
                </TouchableOpacity>
            </View>
        );
    };

    // --- LÓGICA DE AGRUPACIÓN (Mantenida) ---
    const groupDataIntoRows = (data, numColumns) => {
        const grouped = [];
        let rowBuffer = [];

        data.forEach((item) => {
            if (item.type === 'separator') {
                if (rowBuffer.length > 0) {
                    grouped.push({ type: 'row', items: [...rowBuffer], id: `row-${grouped.length}` });
                    rowBuffer = [];
                }
                grouped.push(item);
            } else {
                rowBuffer.push(item);
                if (rowBuffer.length === numColumns) {
                    grouped.push({ type: 'row', items: [...rowBuffer], id: `row-${grouped.length}` });
                    rowBuffer = [];
                }
            }
        });

        if (rowBuffer.length > 0) {
            grouped.push({ type: 'row', items: [...rowBuffer], id: `row-${grouped.length}` });
        }

        return grouped;
    };

    // Preparamos los datos con el separador inyectado
    // --- LÓGICA PARA DIVIDIR CLIENTES ---
    // 1. Mejores clientes (Ejemplo: VIP)
    const mejoresClientes = clientes.filter(c => c.score_frecuencia > 70 && c.status === 'Activo');

    // 2. Clientes que más compran (Ejemplo: más de 20 facturas)
    const clientesQueMasCompran = clientes
        .filter(c => c.total_facturado > 5000 && c.status == 'Activo');

    // 3. Todos los demás
    const otrosClientes = clientes.filter(
        c => !mejoresClientes.includes(c) && !clientesQueMasCompran.includes(c)
    );


    // --- UNIMOS TODO CON SEPARADORES --- //
    const RAW_DATA = [
        (mejoresClientes.length > 0)
            ? [{ id: 'sep-1', type: 'separator', text: 'Mejores clientes' }, ...mejoresClientes]
            : [],
        (clientesQueMasCompran.length > 0)
            ? [{ id: 'sep-2', type: 'separator', text: 'Clientes que más gastan' }, ...clientesQueMasCompran]
            : [],
        (otrosClientes.length > 0)
            ? [{ id: 'sep-3', type: 'separator', text: 'Clientes' }, ...otrosClientes]
            : [],
    ].flat();

    // Generamos los datos agrupados
    const GROUPED_DATA = groupDataIntoRows(RAW_DATA, NUM_COLUMNS);
    // -------------------------------------------------------------

    // Componente para el separador fijo (Mantenido)
    const RenderSeparator = ({ text }) => (
        <View style={styles.separatorContainer}>
            <Texts style={styles.separatorText}>{text}</Texts>
        </View>
    );


    // Componente para una TARJETA INDIVIDUAL
    const ProductCard = ({ item }) => {
        // Lógica de color de estado (status)
        const getStatusColor = (status) => {
            switch (status) {
                case 'VIP':
                    return '#C0B000'; // Dorado
                case 'Activo':
                    return 'green'; // Usar el color original de styles.productPrice
                case 'Inactivo':
                    return '#D32F2F'; // Rojo
                default:
                    return 'green'; // Por defecto, el original
            }
        };

        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => handleSelectClient(item)} // Llama a la nueva función de selección
                activeOpacity={0.7}
            >
                <View style={styles.productImageContainer}>
                    <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
                </View>
                <Texts style={styles.productName}>{item.nombre}</Texts>
                <Texts style={[styles.productName, { fontSize: hp('1.5%') }]}>{item.cedula_rnc}</Texts>
                {/* Se aplica el color de estado (status) dinámicamente, manteniendo los estilos base originales */}
                <Texts style={[styles.productPrice, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Texts>
            </TouchableOpacity>
        );
    };

    // --- 2. RENDERIZADO DE FILAS Y SEPARADORES (Mantenido) ---
    const renderItem = ({ item }) => {
        if (item.type === 'separator') {
            return <RenderSeparator text={item.text} />;
        }

        if (item.type === 'row') {
            return (
                <View style={styles.rowContainer}>
                    {item.items.map((product) => (
                        <ProductCard key={product.id} item={product} />
                    ))}
                    {/* Rellenamos con vistas vacías para mantener alineación si es la última fila incompleta */}
                    {Array.from({ length: NUM_COLUMNS - item.items.length }).map((_, i) => (
                        <View key={`empty-${i}`} style={[styles.productCard, { backgroundColor: 'transparent', elevation: 0 }]} />
                    ))}
                </View>
            );
        }
        return null;
    };
    // ---------------------------------------------

    // Se eliminan funciones de manejo de items de factura que ya no aplican

    return (
        <>
            <View style={styles.container}>
                {/* INVENTARIO */}
                <View style={styles.inventorySection}>
                    <View
                        style={{
                            width: wp('100%'),
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingHorizontal: 5,
                        }}
                    >
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Buscador"
                            placeholderTextColor={'grey'}
                        />
                        <EvilIcons name="search" size={wp('10%')} />
                    </View>
                    <View style={{ height: hp('1%') }}>

                    </View>
                    <FlatList
                        key="manual-rows-list"
                        data={GROUPED_DATA} // Usamos los datos agrupados
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{
                            paddingBottom: 10,
                            width: wp('100%'),
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
            {/* RENDERIZADO CONDICIONAL DEL POP */}
            {showPop && selectedClient && (
                <Pop
                    show={showPop}
                    setShow={setShowPop}
                    content={<RenderClientDetails client={selectedClient} />} // Pasamos el cliente seleccionado
                    styleContent={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        marginBottom: hp('5%'),
                        height: hp('65%'),
                    }}
                />
            )}
        </>
    );
}

// --- ESTILOS ORIGINALES (NO MODIFICADOS) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2ff',
    },

    TextInput: {
        width: wp('86.5%'),
        height: hp('5%'),
        backgroundColor: 'white',
        borderRadius: wp('2%'),
        elevation: 5,
        paddingHorizontal: wp('2%'),
    },

    productImageContainer: {
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp('10%'),
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },

    TypeItemsMenu: {
        width: wp('100%'),
        height: hp('6%'),
        marginLeft: wp('2%'),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },

    inventorySection: {
        flex: 1,
        marginBottom: hp('1%'),
    },

    // --- ESTILOS PARA EL ENCABEZADO FIJO DE LA LISTA (GENERAL) ---
    listHeaderContainer: {
        width: wp('100%'),
        padding: wp('3%'),
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: hp('1%'),
    },
    listHeaderText: {
        fontSize: wp('4.5%'),
        fontWeight: '700',
        color: '#444',
    },
    // ---------------------------------------------

    // --- ESTILOS MEJORADOS PARA EL SEPARADOR INYECTADO ---
    separatorContainer: {
        width: wp('100%'), // Ancho completo
        marginTop: hp('2%'),
        marginBottom: hp('1%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
        backgroundColor: 'transparent', // Sin fondo
        alignItems: 'flex-start', // Alineado a la izquierda
        justifyContent: 'center',
        borderLeftWidth: 4, // Barra de acento
        borderLeftColor: 'green', // Color azul
    },
    separatorText: {
        fontSize: wp('4.5%'), // Texto más grande
        fontWeight: '800', // Más negrita
        color: '#333', // Color oscuro
        textTransform: 'capitalize', // Primera letra mayúscula
    },

    // --- NUEVO ESTILO PARA EL CONTENEDOR DE FILA ---
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Centra las tarjetas en la pantalla
        width: wp('100%'),
        marginBottom: hp('0.5%'), // Espacio entre filas
    },
    // ---------------------------------------------

    productCard: {
        width: wp('31%'),
        backgroundColor: 'white',
        borderRadius: wp('2%'),
        margin: wp('1%'),
        padding: wp('2%'),
        alignItems: 'center',
        elevation: 2,
        gap: wp('2%'),
    },

    productImage: {
        width: wp('22%'),
        height: wp('22%'),
        borderRadius: wp('2%'),
        marginBottom: hp('0.5%'),
    },

    productName: {
        fontSize: hp('1.5%'),
        fontWeight: '600',
        textAlign: 'center',
    },

    productPrice: {
        fontSize: hp('1.5%'),
        color: 'green',
        marginTop: hp('0.3%'),
        textAlign: 'center',
    },

    invoiceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1%'),
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },

    invoiceName: {
        fontSize: hp('1.7%'),
    },

    invoiceDetails: {
        fontSize: hp('1.5%'),
        color: '#555',
    },

    deleteButton: {
        backgroundColor: '#ff4d4d',
        width: wp('6%'),
        height: wp('6%'),
        borderRadius: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('2%'),
    },

    deleteText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: hp('1.4%'),
    },

    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontStyle: 'italic',
        padding: hp('2%'),
    },
});