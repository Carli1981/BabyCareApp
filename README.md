# 👶 BabyCareApp

**BabyCareApp** es una aplicación web/movil desarrollada con **React Native**, **Expo** y **Firebase**, pensada para ayudar a los cuidadores y padres a llevar un seguimiento de las rutinas y eventos importantes relacionados con el cuidado de bebés.

---

## 🚀 Tecnologías utilizadas

- [Expo](https://expo.dev/)
- [Expo Go](https://expo.dev/client)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [React Navigation](https://reactnavigation.org/)
- [Day.js](https://day.js.org/)

---

## 📱 Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Una cuenta de [Firebase](https://firebase.google.com/)
- La app [Expo Go](https://expo.dev/client) en tu dispositivo móvil (para pruebas rápidas)

---

## ⚙️ Instalación

1. Clona este repositorio:


git clone https://github.com/Carli1981/BabyCareApp.git
cd b¡BabyCareApp


2. Instala las dependencias:

npm install
# o si usas yarn
# yarn install

3. Crea un proyecto en
Firebase Console
.
4.Elije la opción web/andriod/iOs

5. Habilita Firestore y Authentication.

6. Crea una nueva base de datos

7. Cambia las credenciales que te genera la nueva base de datos que has creado por las mias en el archivo firebaseConfig.ts, solamente este codigo por el tuyo: 

const firebaseConfig = {
  apiKey: 'AIzaSyBibBybCSFPiPr63Xou5ONOTMhD1aZxcuo',
  authDomain: 'babycareapp-1b761.firebaseapp.com',
  projectId: 'babycareapp-1b761',
  storageBucket: 'babycareapp-1b761.appspot.com', // Puedes dejarlo o quitarlo, no afecta
  messagingSenderId: '300624859846',
  appId: '1:300624859846:web:2d4cfc950f34a1fe843dc7',
};

▶️ Ejecución

npm start
Este comando abrirá Expo Developer Tools en tu navegador. Desde ahí puedes:

Escanear el QR con tu app Expo Go (en el móvil)

Correr la app en un emulador Android/iOS (si lo tienes configurado)

Abrir la app version Web

También puedes usar:

npm run android
npm run ios
npm run web


