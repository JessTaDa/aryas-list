const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url =  require('url');
const path = require('path');

let win
let addWindow

function createWindow () {
  win = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  win.on('closed', () => {
    app.quit();
  })
  // win.webContents.openDevTools()

 const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
 Menu.setApplicationMenu(mainMenu);
}

function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'New victim',
    webPreferences: {
      nodeIntegration: true
    }
  })
  addWindow.loadFile('addWindow.html')
  // addWindow.webContents.openDevTools()

  addWindow.on('closed', () => {
    addWindow = null
  })
}

ipcMain.on('victim:add', function(e, victim){
  console.log(victim)
  win.webContents.send('victim:add', victim);
  addWindow.close()
})

const mainMenuTemplate = [
  {label:'',},
  {
    label: 'Start',
    submenu: [
      {
        label: 'Add Victim',
        click(){
          createAddWindow()
        }
      },
      {
        label: 'Clear All',
        click(){
          win.webContents.send('victim:clear')
        }

      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit()
        }
      }
    ]
  }
];

app.on('ready', createWindow)

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

// If OSX, add empty object to menu
// if(process.platform == 'darwin'){
//   mainMenuTemplate.unshift({});
// }

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools'
  })
}
