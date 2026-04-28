import React, { useState, useEffect } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    TextInput,
    ActivityIndicator
} from 'react-native';
import EvilIcons from '@react-native-vector-icons/evil-icons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import ComponentsHeader from '../../../Components/Headers/ComponentsHeader';
import { useNavigation } from '@react-navigation/native';
import ToggleCart from '../../../Components/Flatlist/ProductosSeleccionados';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Texts from '../../../Components/NativeComponents/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
const ITEM_MARGIN = 10;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (width - ITEM_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS; // Ajusta el ancho de cada item

const itemsype = [
    { id: 'all', nombre: 'Todos' },
    { id: 'tech', nombre: 'Tecnología' },
    { id: 'office', nombre: 'Oficina' },
    { id: 'accessories', nombre: 'Accesorios' },
];

export default function FlatlistProductos() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const obtener_procutos = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.8.106:8000/auth/obtenerProductos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setProducts(Array.isArray(data.productos) ? data.productos : []);
        console.log(data);
        setLoading(false);
    };

    useEffect(() => {
        obtener_procutos();
    }, []);

    const [invoiceItems, setInvoiceItems] = useState([]);
    const navigation = useNavigation();

    // --- 1. LÓGICA DE AGRUPACIÓN (SOLUCIÓN AL EMPUJE DE ÍTEMS) ---
    // Esta función transforma la lista plana en una lista de FILAS y SEPARADORES.
    const groupDataIntoRows = (data, numColumns) => {
        const grouped = [];
        let rowBuffer = [];

        data.forEach((item) => {
            // Si el ítem es un separador, vaciamos el buffer (creamos una fila incompleta si es necesario)
            // y luego añadimos el separador como una fila propia.
            if (item.type === 'separator') {
                if (rowBuffer.length > 0) {
                    grouped.push({ type: 'row', items: [...rowBuffer], id: `row-${grouped.length}` });
                    rowBuffer = [];
                }
                grouped.push(item); // El separador ocupa toda la fila
            } else {
                rowBuffer.push(item);
                // Si el buffer alcanza el número de columnas, creamos una fila
                if (rowBuffer.length === numColumns) {
                    grouped.push({ type: 'row', items: [...rowBuffer], id: `row-${grouped.length}` });
                    rowBuffer = [];
                }
            }
        });

        // Vaciar cualquier ítem restante en el buffer
        if (rowBuffer.length > 0) {
            grouped.push({ type: 'row', items: [...rowBuffer], id: `row-${grouped.length}` });
        }

        return grouped;
    };

    const mejoresProductos = products.filter(c => c.score_frecuencia > 70);

    // 2. Clientes que más compran (Ejemplo: más de 20 facturas)
    const productosMasVendidos = products
        .filter(c => c.total_facturado > 2000);

    // 3. Todos los demás
    const otrosProductos = products.filter(
        c => !mejoresProductos.includes(c) && !productosMasVendidos.includes(c)
    );


    // --- UNIMOS TODO CON SEPARADORES --- //
    const RAW_DATA = [
        (mejoresProductos.length > 0)
            ? [{ id: 'sep-1', type: 'separator', text: 'Mejores productos' }, ...mejoresProductos]
            : [],
        (productosMasVendidos.length > 0)
            ? [{ id: 'sep-2', type: 'separator', text: 'Productos mas vendidos' }, ...productosMasVendidos]
            : [],
        (otrosProductos.length > 0)
            ? [{ id: 'sep-3', type: 'separator', text: 'Productos' }, ...otrosProductos]
            : [],
    ].flat();

    // Generamos los datos agrupados
    const GROUPED_DATA = groupDataIntoRows(RAW_DATA, NUM_COLUMNS);
    // -------------------------------------------------------------

    const handleAddItem = product => {
        setInvoiceItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item,
                );
            } else {
                return [...prevItems, { ...product, cantidad: 1 }];
            }
        });
    };

    const handleRemoveItem = id => {
        setInvoiceItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // Componente para el separador fijo
    const RenderSeparator = ({ text }) => (
        <View style={styles.separatorContainer}>
            <Texts style={styles.separatorText}>{text}</Texts>
        </View>
    );

    // Componente para una TARJETA INDIVIDUAL (extraído para reutilizar)
    const ProductCard = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleAddItem(item)}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
            <Texts style={styles.productName}>{item.nombre}</Texts>
            <Texts style={styles.productPrice}>
                ${item.precio.toFixed(2)}
            </Texts>
        </TouchableOpacity>
    );

    // --- 2. RENDERIZADO DE FILAS Y SEPARADORES ---
    const renderItem = ({ item }) => {
        if (item.type === 'separator') {
            return <RenderSeparator text={item.text} />;
        }

        // Si es una fila de productos, renderizamos el contenedor de fila y mapeamos los items
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

    // Función para renderizar el encabezado fijo de la lista de productos (se mantiene)


    const renderInvoiceItem = ({ item }) => (
        <View style={styles.invoiceItem}>
            <View style={{ flex: 1 }}>
                <Texts style={styles.invoiceName}>{item.nombre}</Texts>
                <Texts style={styles.invoiceDetails}>
                    {item.cantidad} x ${item.valorUnitario.toFixed(2)}
                    <Texts style={{ fontWeight: 'bold' }}>
                        ${(item.cantidad * item.valorUnitario).toFixed(2)}
                    </Texts>
                </Texts>
            </View>
            <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.deleteButton}
            >
                <Texts style={styles.deleteText}>X</Texts>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* LOADING */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    <Text style={{ marginTop: 10, fontSize: 16 }}>Cargando productos...</Text>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.emptyText}>No hay productos disponibles</Text>
                </View>
            ) : (
                <>
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

                        {/* FILTROS */}
                        <View style={styles.TypeItemsMenu}>
                            <FlatList
                                data={itemsype}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <View
                                        style={{
                                            width: 'auto',
                                            height: hp('4%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            paddingHorizontal: 10,
                                            backgroundColor: '#fff',
                                            borderRadius: 8,
                                            elevation: 1,
                                        }}
                                    >
                                        <Text>{item.nombre}</Text>
                                    </View>
                                )}
                            />
                        </View>

                        {/* LISTA DE PRODUCTOS */}
                        <FlatList
                            key="manual-rows-list"
                            data={GROUPED_DATA}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{
                                paddingBottom: 10,
                                width: wp('100%'),
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </>
            )}
        </View>
    );

}

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