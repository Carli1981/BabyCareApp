import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import PantallaInicioSesion from '../pantallas/PantallaInicioSesion';
import PantallaRegistro from '../pantallas/PantallaRegistro';
import PantallaPrincipal from '../pantallas/PantallaPrincipal';
import PantallaRecuperarContrasena from '../pantallas/PantallaRecuperarContrasena';

// 🆕 Importamos las pantallas de las preguntas del bebé
import PreguntaNombre from '../pantallas/PreguntasBebe/PreguntaNombre';
import PreguntaNacimiento from '../pantallas/PreguntasBebe/PreguntaNacimiento';
import PreguntaSexo from '../pantallas/PreguntasBebe/PreguntaSexo';
import PreguntaPeso from '../pantallas/PreguntasBebe/PreguntaPeso';
import PreguntaAltura from '../pantallas/PreguntasBebe/PreguntaAltura';
import PreguntaFoto from '../pantallas/PreguntasBebe/PreguntaFoto';
import PreguntaAlimentacion from '../pantallas/PreguntasBebe/PreguntaAlimentacion';
import PreguntaNotificaciones from '../pantallas/PreguntasBebe/PreguntaNotificaciones';
import ResumenDatosBebe from '../pantallas/PreguntasBebe/ResumenDatosBebe';

// 🍼 Nueva pantalla para editar los datos del bebé
import EditarDatosBebe from '../pantallas/EditarDatosBebe';

const Stack = createStackNavigator();

const Navegacion = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PantallaInicioSesion">
        <Stack.Screen name="PantallaInicioSesion" component={PantallaInicioSesion} options={{ headerShown: false }} />
        <Stack.Screen name="PantallaRegistro" component={PantallaRegistro} options={{ title: 'Registro' }} />
        <Stack.Screen name="PantallaRecuperarContrasena" component={PantallaRecuperarContrasena} options={{ title: 'Recuperar Contraseña' }} />
        <Stack.Screen name="PantallaPrincipal" component={PantallaPrincipal} options={{ headerShown: false }} />

        {/* 🍼 Flujo de preguntas para nuevos usuarios */}
        <Stack.Screen name="PreguntaNombre" component={PreguntaNombre} options={{ headerShown: false }} />
        <Stack.Screen name="PreguntaNacimiento" component={PreguntaNacimiento} options={{ headerShown: false }} />
        <Stack.Screen name="PreguntaSexo" component={PreguntaSexo} options={{ headerShown: false }} />
        <Stack.Screen name="PreguntaPeso" component={PreguntaPeso} options={{ headerShown: false }} />
        <Stack.Screen name="PreguntaAltura" component={PreguntaAltura} options={{ headerShown: false }} />
        <Stack.Screen name="PreguntaFoto" component={PreguntaFoto} options={{ headerShown: false }} />
        <Stack.Screen name="PreguntaAlimentacion" component={PreguntaAlimentacion} options={{ headerShown: false }} />
        <Stack.Screen name="PreguntaNotificaciones" component={PreguntaNotificaciones} options={{ headerShown: false }} />
        <Stack.Screen name="ResumenDatosBebe" component={ResumenDatosBebe} />
        

        {/* 🍼 Nueva pantalla para editar los datos del bebé */}
        <Stack.Screen name="EditarDatosBebe" component={EditarDatosBebe} options={{ title: 'Editar Datos del Bebé' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navegacion;
