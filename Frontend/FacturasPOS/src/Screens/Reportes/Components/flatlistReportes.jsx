import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Texts from '../../../Components/NativeComponents/Text'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function FlatListReportes() {

    const FormatosDGII = [
        {
            id: 1,
            nombre: '606',
            descripcion: 'Compras de bienes y servicios'
        },
        {
            id: 2,
            nombre: '607',
            descripcion: 'Ventas de bienes y servicios'
        },
        {
            id: 3,
            nombre: '608',
            descripcion: 'Nota de crédito'
        },
        {
            id: 4,
            nombre: '609',
            descripcion: 'Proveedores informales y compras menores'
        }
    ];

    const DeclaracionesMensuales = [
        {
            id: 1,
            nombre: 'IT-1',
            descripcion: 'Declaración mensual del ITBIS'
        },
        {
            id: 2,
            nombre: 'IR-17',
            descripcion: 'Declaración de retenciones'
        },
    ];

    const ReportesInternos = [
        {
            id: 1,
            nombre: 'Facturas del mes',
        },
        {
            id: 2,
            nombre: 'Facturas del año',
        },
        {
            id: 3,
            nombre: 'Cotizaciones emitidas',
        }
    ];

    const flatlistReportes = (item) => {
        return (
            <FlatList
                data={item}
                horizontal={true}
                style={{ gap: wp('1%'), marginHorizontal: wp('1%'), marginTop: wp('1%') }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={({ item }) =>

                    <TouchableOpacity style={styles.itemContainer}>
                        <Texts>{item.nombre}</Texts>
                        <Texts style={styles.itemDescription}>{item.descripcion}</Texts>
                    </TouchableOpacity>

                }
            />
        )
    }

    return (
        <View style={styles.container}>

            <View style={styles.section}>
                <Texts style={styles.sectionTitle}>Formatos DGII</Texts>
                {flatlistReportes(FormatosDGII)}
            </View>

            <View style={styles.section}>
                <Texts style={styles.sectionTitle}>Declaraciones Mensuales</Texts>
                {flatlistReportes(DeclaracionesMensuales)}
            </View>

            <View style={styles.section}>
                <Texts style={styles.sectionTitle}>Reportes Internos</Texts>
                {flatlistReportes(ReportesInternos)}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: wp('1%'),
    },
    itemContainer: {
        padding: 10,
        borderBottomColor: '#ccc',
        width: wp('40%'),
        height: wp('40%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2%'),
        backgroundColor: 'white',
        marginHorizontal: wp('1%'),
        gap: wp('1%'),
    },
    section: {
        paddingVertical: wp('2%'),
        gap: wp('2%'),
    },
    sectionTitle: {
        fontSize: wp('5%'),
        paddingHorizontal: wp('3%'),
        marginBottom: wp('1%'),
    },
    itemDescription: {
        fontSize: wp('3.2%'),
        textAlign: 'center',
    },
});