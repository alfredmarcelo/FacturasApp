import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Texts from '../../../Components/NativeComponents/Text';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Margen() {
  const [changecolor, setchangecolor] = useState(true);
  const resta = 15000 - 20000;

  useEffect(() => {
    if (resta < 0) {
      setchangecolor(true);
    }
  }, [resta]);

  return (
    <View style={styles.rowContainer}>
      <View style={styles.card}>
        <Texts style={styles.cardTitle}>Ventas</Texts>
        <Texts style={styles.cardValue}>15,000</Texts>
      </View>

      <View style={styles.card}>
        <Texts style={styles.cardTitle}>Compras</Texts>
        <Texts style={styles.cardValue}>20,000</Texts>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: changecolor ? 'red' : 'green' },
        ]}
      >
        <Texts style={[styles.cardTitle, { color: 'white' }]}>Margen</Texts>
        <Texts style={[styles.cardValue, { color: 'white' }]}>{resta}</Texts>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('97%'),
    height: hp('12%'),
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardValue: {
    marginTop: 6,
    fontSize: 22,
    color: '#6d6c6cff',
  },
});
