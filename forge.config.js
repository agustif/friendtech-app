const { parsed } = require("dotenv").config();
module.exports = {
  packagerConfig: {
    name: "Friend.Tech",
    executableName: "Friend.Tech",
    icon: "images/icon",
    appBundleId: "com.agustif.friendtechosx",
    extendInfo: {
      LSUIElement: "true",
    },
    osxSign: {
      hardenedRuntime: false,
      gatekeeperAssess: false,
      // FIXME: Add notarization for better installation UX on Mac
      // identity: "Developer ID Application: Lyser.io Ltd (R4PF6TTR6Z)",
    },
    // FIXME: Add notarization for better installation UX on Mac
    // osxNotarize: {
    //   appBundleId: "ccom.agustif.friendtechosx",

    //   tool: "notarytool",
    //   appleId: parsed.APPLE_ID,
    //   appleIdPassword: parsed.APPLE_PASSWORD,
    //   teamId: parsed.APPLE_TEAM_ID,
    // },
  },
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "agustif",
          name: "friendtech-menubar-app",
        },
        prerelease: true,
      },
    },
  ],

  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
