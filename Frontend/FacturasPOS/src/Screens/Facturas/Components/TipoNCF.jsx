import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';

export default function TipoNCF({ setgetitems, tipoCliente, setshowTipoNCF }) {

  const dataFormal = [
    { id: '1', label: 'B01', value: 'B01' },
    { id: '2', label: 'B03', value: 'B03' },
    { id: '3', label: 'B04', value: 'B04' },
  ];

  const dataNoFormal = [
    { id: '1', label: 'B02', value: 'B02' },
  ];

  const tipo = tipoCliente.nombre === 'Factura no formal' ? dataNoFormal : dataFormal;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Texts>Tipo NCF</Texts>
      </View>

      <View style={styles.body}>
        <FlatList
          data={tipo}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.content}
              onPress={() => {
                setgetitems(item.value);
                setshowTipoNCF(false);
              }}
            >
              <Texts>{item.label}</Texts>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  body: {
    width: '100%',
    height: '100%',
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
  },
});
