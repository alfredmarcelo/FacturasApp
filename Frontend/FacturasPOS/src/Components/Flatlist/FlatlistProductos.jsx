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
import ComponentsHeader from '../Headers/ComponentsHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import ToggleCart from '../Flatlist/ProductosSeleccionados';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Texts from '../NativeComponents/Text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

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
  const router = useRoute();
  const { Productos } = router.params;
  const [invoiceItems, setInvoiceItems] = useState([]);
  const navigation = useNavigation();

  // Calcular cantidad total de productos (suma de todas las cantidades)
  const totalCantidad = invoiceItems.reduce((acc, item) => acc + item.cantidad, 0);


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

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleAddItem(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
      <Texts style={styles.productName}>{item.nombre}</Texts>
      <Texts style={styles.productPrice}>
        ${item.precio}
      </Texts>
    </TouchableOpacity>
  );

  const renderInvoiceItem = ({ item }) => (
    <View style={styles.invoiceItem}>
      <View style={{ flex: 1 }}>
        <Texts style={styles.invoiceName}>{item.nombre}</Texts>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Texts style={styles.invoiceDetails}>
            {item.cantidad} x ${item.cantidad * item.precio}
          </Texts>
          <Texts style={styles.invoiceDetails}>
            C/U x ${item.precio}
          </Texts>
        </View>
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
      {/* INVENTARIO */}
      <ComponentsHeader onPress={() => navigation.goBack()} />
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
          <TouchableOpacity
            style={{
              width: wp('10%'),
              height: hp('5%'),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
              elevation: 5,
            }}
          >
            <MaterialDesignIcons name="robot" size={wp('8%')} color="#404040" />
          </TouchableOpacity>
        </View>
        <View style={styles.TypeItemsMenu}>
          <FlatList
            data={itemsype}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
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
              </TouchableOpacity>
            )}
          />
        </View>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{
            paddingBottom: 10,
            width: wp('100%'),
            justifyContent: 'center',
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {/* FACTURA */}
      <ToggleCart
        renderItem={renderInvoiceItem}
        Productos={Productos}
        route={router}
        items={invoiceItems}
        onRemoveItem={handleRemoveItem}
        totalCantidad={totalCantidad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e2e2ff',
  },

  TextInput: {
    width: wp('76%'),
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
