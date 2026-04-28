import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FrontPanel } from '../Screens/FrontPanel/FrontPanel';
import FrontPanelFacturas from '../Screens/Facturas/FrontPanelFacturas';
import Crear from '../Screens/Facturas/Crear';
import FlatlisProductos from '../Components/Flatlist/FlatlistProductos';
import FacturaCreada from '../Screens/Facturas/FacturaCreada';
import Login from '../Screens/Login/Login';
import FrontPanelCotizaciones from '../Screens/Cotizaciones/FrontPanelCotizaciones';
import CrearCotizacion from '../Screens/Cotizaciones/CrearCotizacion';
import Clientes from '../Screens/POS/Clientes';
import Productos from '../Screens/POS/Productos';
import CrearProducto from '../Screens/POS/Components/CrearProducto';
import Reportes from '../Screens/Reportes/Reportes';
import Anna from '../Screens/AnnaContable/Anna';
import Camara from '../Components/Camara/Camara';
import Whatsapp from '../Screens/CRM/Whatsapp';
import CotizacionCreada from '../Screens/Cotizaciones/CotizacionCreada';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FrontPanel"
        component={FrontPanel}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FrontPanelFacturas"
        component={FrontPanelFacturas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FrontPanelCotizaciones"
        component={FrontPanelCotizaciones}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Crear"
        component={Crear}
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="FlatlisProductos"
        component={FlatlisProductos}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FacturaCreada"
        component={FacturaCreada}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrearCotizacion"
        component={CrearCotizacion}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Clientes"
        component={Clientes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Productos"
        component={Productos}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrearProducto"
        component={CrearProducto}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reportes"
        component={Reportes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Anna"
        component={Anna}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camara"
        component={Camara}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Whatsapp"
        component={Whatsapp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CotizacionCreada"
        component={CotizacionCreada}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
