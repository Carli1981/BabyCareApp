// navegacion/navegacion.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PantallaInicioSesion from '../pantallas/PantallaInicioSesion';
import PantallaRegistro from '../pantallas/PantallaRegistro';
import PantallaPrincipal from '../pantallas/PantallaPrincipal';
import PantallaRecuperarContrasena from '../pantallas/PantallaRecuperarContrasena';

const Stack = createStackNavigator();

const Navegacion = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PantallaInicioSesion">
        <Stack.Screen
          name="PantallaInicioSesion"
          component={PantallaInicioSesion}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PantallaRegistro"
          component={PantallaRegistro}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen
          name="PantallaPrincipal"
          component={PantallaPrincipal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PantallaRecuperarContrasena"
          component={PantallaRecuperarContrasena}
          options={{ title: 'Recuperar Contraseña' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navegacion;