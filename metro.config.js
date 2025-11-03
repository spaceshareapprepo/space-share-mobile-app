// @ts-nocheck
// Keep this file in CommonJS; Expo's Metro loader expects a CJS export.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './app/global.css' });
