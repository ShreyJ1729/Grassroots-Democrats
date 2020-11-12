const {app, BrowserWindow, dialog, ipcMain} = require('electron')

const url = require('url')
const path = require('path')
const fs=require('fs')


// const {dialog}=require('electron')

let win

function createWindow() {
   win = new BrowserWindow({
     width: 800,
     height: 600,
     webPreferences: { 
      nodeIntegration: true,
     }
    })
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }))
   win.openDevTools();
  //  win.maximize();
}

ipcMain.handle('signup-click-button', (event,arg)=>{
    if(arg=='true'){
      console.log("got button click");

      dialog.showOpenDialog()
      .then( (result) => {
        const filenames = result.filePaths;

        if(filenames==undefined) {
          console.log("No file selected");
        }
        else {
          readFile(filenames[0])
          win.loadURL(`file://${__dirname}/up_address.html`);
        }
      }).catch(err => {
        console.log(err)
      })

    }
})

let signup_data;

function readFile(filepath){
  console.log("reading file...");
  console.log(filepath);
  fs.readFile(filepath,'utf-8',(err,data)=>{
    signup_data = data;
    if(err){
      alert("An error :"+err.message)
      return
    }
    win.webContents.send('fileData',data);
  })

}

app.on('ready', createWindow);