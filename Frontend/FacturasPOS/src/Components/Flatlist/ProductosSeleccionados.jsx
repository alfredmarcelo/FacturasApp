import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { height } = Dimensions.get('window');

export default function ToggleCart({
  onRemoveItem,
  items,          // los productos seleccionados
  renderItem,
  route,     // función callback desde el padre
  totalCantidad = 0  // cantidad total de todos los productos
}) {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const panelHeight = hp('50%');
  const slideAnim = useRef(new Animated.Value(panelHeight)).current;

  const toggleMenu = () => {
    const nextOpen = !open;
    Animated.spring(slideAnim, {
      toValue: nextOpen ? 0 : panelHeight,
      friction: 10,
      tension: 50,
      useNativeDriver: true,
    }).start();
    setOpen(nextOpen);
  };

  const continuar = () => {
    route.params?.Productos?.(items);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Botón superior */}
      <TouchableOpacity
        style={styles.topButton}
        onPress={toggleMenu}
      >
        <Text style={{ marginBottom: 10 }}>
          {open ? '▼ Ocultar productos' : '⯅ Mostrar productos'} ({totalCantidad || 0})
        </Text>
      </TouchableOpacity>

      {/* Panel deslizable */}
      <Animated.View
        style={[
          styles.slidePanel,
          {
            transform: [{ translateY: slideAnim }],
            height: panelHeight,
          },
        ]}
      >
        <TouchableOpacity style={styles.innerToggle} onPress={toggleMenu}>
          <Text style={{ marginBottom: 10 }}>
            {open ? '▼ Ocultar productos' : '⯅ Mostrar productos'} ({totalCantidad || 0})
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>Productos seleccionados</Text>

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          style={{ maxHeight: 200 }}
          renderItem={renderItem}
        />

        {/* Botón continuar */}
        <TouchableOpacity style={styles.btnContinuar} onPress={continuar}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
          <Text style={styles.btnContinuarText}> Continuar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'flex-end', width: '100%' },
  topButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('5%'),
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  slidePanel: {
    position: 'absolute',
    bottom: 0,
    width: wp('100%'),
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  innerToggle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  btnContinuar: {
    backgroundColor: '#aeafb1ff',
    padding: 14,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnContinuarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
