const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prefer CommonJS entry points when packages ship both. zustand v5's ESM
// build uses `import.meta`, which neither Hermes nor Metro's web output
// supports on SDK 54; resolving the `require` condition avoids it.
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config;
