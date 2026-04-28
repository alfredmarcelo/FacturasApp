import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import Texts from '../../../Components/NativeComponents/Text';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function VentasyCompras() {
  const lineData = [
    { value: 0, label: '10 Ene' },
    { value: 10, label: '10 Feb' },
    { value: 8, label: '10 Mar' },
    { value: 58, label: '10 Abr' },
    { value: 56, label: '10 May' },
    { value: 78, label: '10 Jun' },
    { value: 74, label: '10 Jul' },
    { value: 98, label: '10 Ago' },
    { value: 78, label: '10 Sep' },
    { value: 74, label: '10 Oct' },
    { value: 98, label: '10 Nov' },
    { value: 98, label: '10 Dic' },
  ];

  const lineData2 = [
    { value: 0 },
    { value: 20 },
    { value: 18 },
    { value: 40 },
    { value: 36 },
    { value: 60 },
    { value: 54 },
    { value: 85 },
    { value: 80 },
    { value: 69 },
    { value: 90 },
    { value: 80 },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.Header}>
        <Texts style={styles.HeaderTitle}>Ventas vs Compras</Texts>

        <TouchableOpacity style={styles.Dato}>
          <Texts style={{ fontWeight: '600', color: '#333' }}>Ver</Texts>
        </TouchableOpacity>
      </View>

      {/* CHART */}
      <View style={styles.ChartStyle}>
        <LineChart
          rotateLabel
          data={lineData}
          data2={lineData2}
          height={hp('30%')}
          spacing={wp('10%')}
          initialSpacing={0}
          verticalLinesColor="transparent"
          color1="#1E90FF"
          color2="#FFA500"
          dataPointsHeight={6}
          dataPointsWidth={0}
          textColor1="#444"
          textShiftY={-6}
          textFontSize={10}
          thickness={2}
          xAxisThickness={0}
          yAxisThickness={0}
          formatYLabel={label => `${label}$`}
        />
      </View>

      {/* FOOTER LEGENDS */}
      <View style={styles.Footer}>
        <View style={styles.Contenedor}>
          <View style={[styles.ContenedorColor, { backgroundColor: '#1E90FF' }]} />
          <Texts style={styles.LegendText}>Ventas</Texts>
        </View>

        <View style={styles.Contenedor}>
          <View style={[styles.ContenedorColor, { backgroundColor: '#FFA500' }]} />
          <Texts style={styles.LegendText}>Compras</Texts>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp('95%'),
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,

    // 📌 sombra igual al resto de panels
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,

    marginBottom: 20,
  },

  Header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  HeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  Dato: {
    height: 32,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  ChartStyle: {
    width: wp('90%'),
    justifyContent: 'center',
    alignItems: 'center',
  },

  Footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 10,
  },

  Contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ContenedorColor: {
    width: 20,
    height: 10,
    marginRight: 6,
    borderRadius: 20,
  },

  LegendText: {
    fontSize: 13,
    color: '#333',
  },
});
