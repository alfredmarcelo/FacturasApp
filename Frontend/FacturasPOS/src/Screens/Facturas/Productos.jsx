import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import Texts from '../../Components/NativeComponents/Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontawesome from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

// 📌 Importación RESPONSIVE
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Productos({ setsubtotal }) {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);

  const hayDatos = productos.length > 0;
  useEffect(() => {
    setsubtotal(productos);
  }, [productos]);

  const handleRemoveItem = id => {
    setProductos(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            if (item.cantidad > 1) {
              return { ...item, cantidad: item.cantidad - 1 };
            } else {
              return null;
            }
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  return (
    <View style={style.Container}>
      <View style={style.headertext}>
        <Texts style={{ fontSize: wp('5%'), fontWeight: '500' }}>Productos</Texts>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('FlatlisProductos', {
              productosExistentes: productos,
              Productos: items => {
                // Acumular productos nuevos con los existentes
                setProductos(prevProductos => {
                  const nuevosProductos = [...prevProductos];
                  items.forEach(newItem => {
                    const existingIndex = nuevosProductos.findIndex(p => p.id === newItem.id);
                    if (existingIndex >= 0) {
                      // Si ya existe, sumar las cantidades
                      nuevosProductos[existingIndex] = {
                        ...nuevosProductos[existingIndex],
                        cantidad: nuevosProductos[existingIndex].cantidad + newItem.cantidad
                      };
                    } else {
                      // Si no existe, agregarlo
                      nuevosProductos.push(newItem);
                    }
                  });
                  return nuevosProductos;
                });
              },
            })
          }
          style={style.AgregarBtn}
        >
          <Texts style={{ fontWeight: '500', fontSize: wp('3.5%') }}>
            Agregar Producto
          </Texts>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Camara')}
          style={style.AgregarBtn}
        >
          <Texts style={{ fontWeight: '500', fontSize: wp('3.5%') }}>
            Escanear
          </Texts>
        </TouchableOpacity>
      </View>

      <View style={style.Body}>
        {!hayDatos ? (
          <View style={style.BodyContent}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={wp('15%')}
              color="#ccc"
            />
            <Texts
              style={{
                fontSize: wp('4%'),
                marginTop: hp('1%'),
                color: '#888',
              }}
            >
              Agrega un producto para comenzar
            </Texts>
          </View>
        ) : (
          <FlatList
            data={productos}
            keyExtractor={item => item.id.toString()}
            style={{ width: '100%' }}
            contentContainerStyle={{
              gap: hp('1.5%'),
              padding: wp('4%'),
              paddingBottom: hp('3%'),
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={style.ItemCard}>
                <View style={{ gap: hp('0.5%') }}>
                  <View style={style.Productoheader}>
                    <View
                      style={{
                        width: wp('12%'),
                        height: wp('12%'),
                        borderRadius: 5,
                        backgroundColor: 'white',
                      }}
                    />
                    <Texts style={style.ItemName}>{item.nombre}</Texts>
                  </View>

                  <Texts style={style.ItemId}>
                    Valor Unidad: {item.precio}
                  </Texts>
                  <Texts style={style.ItemId}>
                    Itbis del producto:{' '}
                    {((item.itbis / 100) * item.precio).toFixed(2)} (
                    {item.itbis}%)
                  </Texts>
                  <Texts style={style.ItemId}>
                    Cantidad:{' '}
                    {item.cantidad}
                  </Texts>
                </View>

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
                    gap: hp('4%'),
                  }}
                >
                  <Texts style={style.ItemPrice}>
                    RD$ {item.precio * item.cantidad}
                  </Texts>

                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                    <Feather name="trash-2" size={wp('6%')} color="rgba(250, 8, 8, 0.62)" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  Container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },

  headertext: {
    width: '100%',
    height: hp('7%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    marginBottom: hp('1.5%'),
  },

  AgregarBtn: {
    backgroundColor: 'white',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    elevation: 2,
  },

  Body: {
    flex: 1,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
    elevation: 3,
  },

  BodyContent: {
    flex: 1,
    padding: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  ItemCard: {
    width: '100%',
    height: hp('15%'),
    backgroundColor: '#b6b3b3ff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ItemName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
  },

  ItemId: {
    fontSize: wp('3%'),
    color: '#313131ff',
  },

  ItemPrice: {
    fontSize: wp('4%'),
    color: '#080808ff',
  },

  Productoheader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
});
