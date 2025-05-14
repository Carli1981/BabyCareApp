const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Asegura que los archivos .cjs también se resuelvan
defaultConfig.resolver.sourceExts.push("cjs");

// 🚨 Esta línea desactiva la resolución problemática de `package.exports`
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
