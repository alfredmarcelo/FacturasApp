import { StyleSheet, Text, View } from 'react-native';
import TypeCharts from './Charts';
import Texts from '../../../Components/NativeComponents/Text';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function FrontPanelCard({ total_ventas, total_compras }) {

  const ventas = Number(total_ventas) || 0;
  const compras = Number(100) || 0;

  const total = ventas + compras;

  const porcentaje_compras = total > 0
    ? (compras / total) * 100
    : 0;

  const porcentaje_ventas = total > 0
    ? (ventas / total) * 100
    : 0;


  return (
    <View style={style.container}>
      <View style={style.chartStyle}>
        <View style={style.BarContainer}>
          <View style={[style.Bar, { height: `${porcentaje_ventas}%` }]}></View>
        </View>
        <View style={style.BarContainer}>
          <View style={[style.Bar2, { height: `${porcentaje_compras}%` }]}></View>
        </View>
      </View>
      <View style={style.content}>
        <View style={style.contentHeader}>
          <Texts style={{ fontSize: 20, fontWeight: '300' }}>
            Estado: <Texts style={{ color: '#eed024ff' }}>Decente</Texts>
          </Texts>
        </View>
        <View style={style.data}>
          <View style={style.datacharts}>
            <View style={style.dataContentcharts}>
              <TypeCharts IconType={'Compras'} total_ventas={porcentaje_ventas} total_compras={porcentaje_compras} />
            </View>
            <View style={style.dataContentcharts}>
              <TypeCharts IconType={'Ventas'} total_ventas={porcentaje_ventas} total_compras={porcentaje_compras} />
            </View>
          </View>
          <View style={style.prediccionChart}>
            <Texts>Prediccion</Texts>
            <View
              style={{
                width: '70%',
                height: '55%',
                borderRadius: 10,
                marginTop: 5,
                backgroundColor: 'grey',
              }}
            ></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: wp('95%'),
    height: hp('25%'),
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 20,
    elevation: 10,
  },
  chartStyle: {
    width: wp('37%'),
    backgroundColor: '#eed0245e',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  BarContainer: {
    height: hp('25%'),
    width: wp('15%'),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  Bar: {
    width: wp('6%'),
    height: '50%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: 'green',
    position: 'relative',
  },
  Bar2: {
    width: wp('6%'),
    height: '80%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: 'red',
    position: 'relative',
  },
  content: {
    width: '60%',
    height: '100%',
  },
  contentHeader: {
    width: '100%',
    height: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  data: {
    width: '100%',
    height: hp('18%'),
    flexDirection: 'row',
  },
  datacharts: {
    width: wp('28%'),
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  prediccionChart: {
    width: wp('30%'),
    height: hp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataContentcharts: {
    width: wp('28%'),
    height: '40%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
