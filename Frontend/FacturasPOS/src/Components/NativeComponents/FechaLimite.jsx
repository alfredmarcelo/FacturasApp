import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Texts from './Text';

export default function FechaLimite({ setgetitems, setShowFechaLimite }) {
  const data = [
    { id: '1', label: '30 días', value: '30' },
    { id: '2', label: '60 días', value: '60' },
    { id: '3', label: '90 días', value: '90' },
    { id: '4', label: '120 días', value: '120' },
  ]
  return (
    <View style={style.Container}>
      <View style={style.header}>
        <Texts>Seleccionar Fecha Límite</Texts>
      </View>
      <View style={style.Body}>
        <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (
          <TouchableOpacity style={style.content} onPress={() => [setgetitems(item.value), setShowFechaLimite(false)]}>
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
