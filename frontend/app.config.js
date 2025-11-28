export default ({ config }) => ({
  ...config,
  name: process.env.APP_VARIANT === "dev" ? "Stretches V2 Dev" : "StretchesV2",
  slug: "stretches",
  version: "1.3.2",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier:
      process.env.APP_VARIANT === "dev"
        ? "com.plasmadiffusion.stretchesdev"
        : "com.plasmadiffusion.stretches",
    buildNumber: process.env.BUILD_NUMBER || "1",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package:
      process.env.APP_VARIANT === "dev"
        ? "com.plasmadiffusion.stretchesdev"
        : "com.plasmadiffusion.stretches",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "5963bd8b-f61b-4bd8-98e3-2b51802d5c48",
    },
  },
  owner: "plasmadiffusion",
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/5963bd8b-f61b-4bd8-98e3-2b51802d5c48",
  },
});
