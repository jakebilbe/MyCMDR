<p align="center">
<img src ="http://i.imgur.com/Ys5NPR5.png"/>
</p>

**MyCMDR** is a Companion Application for  **Elite: Dangerous** that runs on your PC, it creates a local Web Server for your Devices *(Mobile Phone, Tablet, Laptop, TV, etc)* to connect to and display data from your Journal Log files. The best thing about **MyCMDR** is that it's Open Source allowing anyone to edit what it displays, how it displays it and the most important thing, that it runs on any device with a WebBrowser.

## How it Works
Using **Node.JS** as the base Framework, it utilizes **Express** to create a local Web Server that you can connect to with any device that has Internet Capabilities. The main application reads your Journal Logs, indexing the last entry it reads and passing that Data to an array that holds all of your CMDR Information. It then uses **Socket.io** to pass this array onto the **Client** that is connected, it will only send data *IF* a **Client** is connected and *IF* there is new information.

The **Client** then takes this information and stores it in another array that is local, you can then utilize addons (made by myself or others) to display this data in different ways. The majority of the work is done by your PC helping it to feel quick and smooth on your Device.

## Getting Started
### Users
* Go to [Releases](https://github.com/MemoryPattern/MyCMDR/releases) and download the latest
* Extract to your Directory of choice
* Start **MyCMDR** by opening **MyCMDR.exe**
* On your **Device** open your WebBrowser and type in the IP:PORT displayed on the app

 *(e.g. 192.168.0.5**:**2000, remember to place colon between IP and PORT)*

### Developers
* Choose a method of obtaining the Source *(Clone, Fork, Download)*
* Extract to a Directory of your choice
* Make sure you have NPM, Node.JS and Electron installed
* Start the application with `electron .` whilst in the Directory

If you need to change the Port or Window Size, open `MyCMDR-win32-x64\resources\app\config.json` with a Text Editor, edit and save.

**Useful Information:** The Main.js file will create the Electron window, it will then initialize the Server and Socket.io before creating a reference of the CMDR Class to store Data inside, it then runs Cmdr.Update() every X seconds as specified inside *interval*. Inside Cmdr.Update() it will load *ALL* Journal Files on runtime to account for any bounties/etc received before the latest created file. It keeps an index of the Last File/Line read and after the first initialization it will only load newer entries. Once it has stored this Data in the CMDR Class it then sends it via Socket.io to the Client index.html.

On the Client Side, it begins by referencing the Menu Tabs/Buttons and then receiving the data, on both sides bounties/exploration data/trade data are stored in Arrays, though I cannot remember why I did this and is subject to change shortly. I'm using Bootstrap for the layout and some custom CSS for the theme and other bits.

## Built With
* [Socket.io](https://github.com/socketio/socket.io) - Allows exchanging information between Client and Server
* [Express](https://github.com/expressjs/express) - Web Framework to Display Companion Application
* [Electron](https://github.com/electron/electron) - Cross-platform desktop applications using JavaScript, HTML and CSS
* [Electron Packager](https://github.com/electron-userland/electron-packager) - Allows building Standalone Electron applications

## Screenshots
<img src ="http://i.imgur.com/T1FuGAb.png" />
<img src ="http://i.imgur.com/NkuYeHm.png" />
<img src ="http://i.imgur.com/tCQgOqt.png" />
