//encargado de buscar la ruta del archivo index.html y cargarlo en la ventana principal de la aplicación.
import { app, BrowserWindow } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'

// función createWindow Esta función crea una nueva ventana de navegador utilizando BrowserWindow. 
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920 ,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

//Utilizamos win.loadURL para cargar la URL de nuestra aplicación. 
  win.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, 'dist', 'index.html')}`
  )
  //En el entorno de desarrollo, utilizamos win.webContents.openDevTools() para abrir las herramientas de desarrollo de Chrome para la ventana. Esto es útil para depurar y desarrollar nuestra aplicación.
  if (isDev) {
    win.webContents.openDevTools()
  }
}

//app.whenReady() se ejecuta cuando la aplicación de Electron está lista para crear ventanas de navegador.
app.whenReady().then(createWindow)

//app.on('window-all-closed') se ejecuta cuando todas las ventanas de la aplicación están cerradas.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//app.on('activate') se ejecuta cuando la aplicación de Electron se activa.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
