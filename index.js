require("update-electron-app")();

const { menubar } = require("menubar");
const { initialize, trackEvent } = require("@aptabase/electron/main");
// const { trackEvent } =  require("@aptabase/electron/main");

const path = require("path");
const {
  app,
  nativeImage,
  Tray,
  Menu,
  globalShortcut,
  shell,
} = require("electron");
const contextMenu = require("electron-context-menu");

const image = nativeImage.createFromPath(
  path.join(__dirname, `images/newiconTemplate.png`)
);


initialize("A-EU-3747915657"); // 👈 this is where you enter your App Key
app.on("ready", () => {
  // Nucleus.init("638d9ccf4a5ed2dae43ce122");
  trackEvent("app_started"); // An event with no properties

  const tray = new Tray(image);
  const mb = menubar({
    browserWindow: {
      icon: image,
      transparent: path.join(__dirname, `images/iconApp.png`),
      // type: 'toolbar',
      webPreferences: {
        webviewTag: true,
        nativeWindowOpen: true,
      },
      width: 370,
      height: 750,
    },
    tray,
    showOnAllWorkspaces: true,
    preloadWindow: true,
    showDockIcon: false,
    icon: image,
  });

  function toggle(darkMode) {
    let q = document.querySelectorAll('#nightify')
    if(q.length) {
      q[0].parentNode.removeChild(q[0])
    }
    var h = document.getElementsByTagName('head')[0],
        s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.setAttribute('id', 'nightify');
    if (darkMode) {
      s.appendChild(document.createTextNode('html{-webkit-filter:invert(100%) hue-rotate(180deg) contrast(70%) !important; background: #111;} img, video { -webkit-filter: invert(100%) hue-rotate(180deg) contrast(70%) !important; } .line-content {background-color: #222;}'));
    } else {
      s.appendChild(document.createTextNode('html{-webkit-filter:invert(0%) hue-rotate(0deg) contrast(100%) !important; background: #fff;} img, video { -webkit-filter: invert(0%) hue-rotate(0deg) contrast(100%) !important; } .line-content {background-color: #fefefe;}'));
    }
    h.appendChild(s); 
  }

  function setTheme(theme) {
    if (theme === 'light') {
      toggle(false);
      localStorage.setItem('mode', 'light');
    } else if (theme === 'dark') {
      toggle(true);
      localStorage.setItem('mode', 'dark');
    } else if (theme === 'system') {
      toggle(darkMode);
      localStorage.setItem('mode', 'system');
    }
  }
  
  mb.on("ready", () => {
    const { window } = mb;

    if (process.platform !== "darwin") {
      window.setSkipTaskbar(true);
    } else {
      app.dock.hide();
    }

    const contextMenuTemplate = [
      // add links to github repo and vince's twitter
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit();
        },
      },
      {
        label: "Reload",
        accelerator: "Command+R",
        click: () => {
          window.reload();
        },
      },
      {
        label: "Open in browser",
        click: () => {
          shell.openExternal("https://friend.tech");
        },
      },
      {
        type: "separator",
      },
      {
        label: "View on GitHub",
        click: () => {
          shell.openExternal("https://github.com/agustif/friendtech-menubar-app");
        },
      },
      {
        label: "Go to Agusti's FT Room",
        click: () => {
          window.webContents.loadURL("https://www.friend.tech/rooms/0xf5e9a212c15aa67a7658048f59ec3e88bc9c0ea2");
        },
      },
      {
        label: "Agusti on Twitter",
        click: () => {
          shell.openExternal("https://twitter.com/0xAgusti");
        },
      },
      {
        type: "separator",
      },
      {
        label: "Go to Home",
        accelerator: "CommandOrControl+Shift+H",
        click: () => {
          window.webContents.loadURL("https://friend.tech/portfolio");
        },
      },
      {
        label: "Go to Chats",
        accelerator: "CommandOrControl+Shift+C",
        click: () => {
          window.webContents.loadURL("https://friend.tech/chats");
        },
      },
      {
        label: "Go to Watchlist",
        accelerator: "CommandOrControl+Shift+W",
        click: () => {
          window.webContents.loadURL("https://friend.tech/watchlist");
        },
      },
      {
        label: "Go to Explore/Search",
        accelerator: "CommandOrControl+Shift+S",
        click: () => {
          window.webContents.loadURL("https://friend.tech/search");
        },
      },
      {
        label: "Go to Airdrop",
        accelerator: "CommandOrControl+Shift+A",
        click: () => {
          window.webContents.loadURL("https://friend.tech/airdrop");
        },
      },
      {
        label: "Go to Account Settings",
        accelerator: "CommandOrControl+Shift+.",
        click: () => {
          window.webContents.loadURL("https://friend.tech/account");
        },
      },
      {
        label: "Theme",
        submenu: [
          {
            label: "Light",
            type: "radio",
            checked: mb.window.webContents.executeJavaScript(
              `window.matchMedia('(prefers-color-scheme: light)').matches || window.matchMedia('(prefers-color-scheme: no-preference)').matches || window.localStorage.getItem('mode') === 'light'`
            ),
            click: () => {
              setTheme("light");
            },
          },
          {
            label: "Dark",
            type: "radio",
            checked: mb.window.webContents.executeJavaScript(
              `window.matchMedia('(prefers-color-scheme: dark)').matches || window.localStorage.getItem('mode') === 'dark'`
            ),
            click: () => {
              setTheme("dark");
            },
          },
          {
            label: "System",
            type: "radio",
            checked: mb.window.webContents.executeJavaScript(
              `window.localStorage.getItem('mode') === 'system'`
            ),
            click: () => {
              setTheme("system");
            },
          },
        ],
      },
    ];

    tray.on("right-click", () => {
      mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
    });

    tray.on("click", (e) => {
      //check if ctrl or meta key is pressed while clicking
      e.ctrlKey || e.metaKey
        ? mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate))
        : null;
    });

    globalShortcut.register("CommandOrControl+Shift+y", () => {
      if (window.isVisible()) {
        mb.hideWindow();
      } else {
        mb.showWindow();
        if (process.platform == "darwin") {
          mb.app.show();
        }
        mb.app.focus();
      }
    });

    console.log("Menubar app is ready.");

    // Set window properties
    window.setAlwaysOnTop(true, "floating");
    window.setVisibleOnAllWorkspaces(true);
    window.setFullScreenable(false);
  });

  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      // open link with external browser in webview
      contents.on("new-window", (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });
      // set context menu in webview
      contextMenu({
        window: contents,
      });

      // we can't set the native app menu with "menubar" so need to manually register these events
      // register cmd+c/cmd+v events
      contents.on("before-input-event", (event, input) => {
        const { control, meta, key } = input;
        if (!control && !meta) return;
        if (key === "c") contents.copy();
        if (key === "v") contents.paste();
        if (key === "a") contents.selectAll();
        if (key === "z") contents.undo();
        if (key === "y") contents.redo();
        if (key === "q") app.quit();
        if (key === "r") contents.reload();
      });
    }
  });

  if (process.platform == "darwin") {
    // restore focus to previous app on hiding
    mb.on("after-hide", () => {
      mb.app.hide();
    });
  }

  // open links in same window
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
      // do not prevent default behavior
      trackEvent("visited", {
        url: navigationUrl,
      }); // An event with no properties
    });
  });

  // prevent background flickering
  app.commandLine.appendSwitch(
    "disable-backgrounding-occluded-windows",
    "true"
  );

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});