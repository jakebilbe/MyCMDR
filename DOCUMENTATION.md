# Using an Addon
When downloading an Addon to use with MyCMDR you may have a zip/rar/7z file that *should* contain a Folder with at least 3 files, the structure should be as follows:

```
Directory
  > .CSS *(Optional)*
  > .HTML
  > .JS
```

It doesn't matter what the names of these files are called, but as a precaution do not alter any file structure of an addon unless the Creator says to do so. Once you have this Directory place it inside your `/client/addons/` folder or click the Addons button inside the MyCMDR Server application to open the folder.

# Creating an Addon
MyCMDR will check the `/client/addons/` folder for any Directories, it will use whatever your Directories name is for the Addon Name on the Client (Menu ID, Menu Title, etc).

Inside your directory please include the following:

** *.CSS ** - If your addon requires styling, please name your class/ids appropriately as all Addons have their css pasted into a global `<style>` tag due to loading issues.

** *.HTML ** - The core of your Addon, the content of this file will be stored inside a preset div tag and placed in its own custom `<div id="ADDON_NAME">` tag so that it can be toggled with the menu.

** *.JS ** - Your Script that controls your HTML content will **ALWAYS** be placed after CORE.js and ADDONS.js so that you can use data from the CORE file, see below.

### DEVELOPER COMMANDS
When developing an Addon due to how MyCMDR handles them you'll have to manually reload all addons, you can do this by reloading MyCMDR or typing **reloadAddons();** into the Developer Console on your browser.

# Accessing the Data
When MyCMDR first starts up, it reads through every log file, keeping an index of the file/line it's on and then runs every 1 second after. It will only update information if it's newer than the last line/file.

Once it's finished processing this data it then sends this information through Socket.io to the client **only** if it contains something new. The Client then parses this data in CORE.js and stores it into arrays. I've split up Bounties, Trading and Exploration as these need to be checked server side for a timeStamp so that they are not repeatedly added.

Once a player has cashed in a Bounty the Bounties will appear empty, trade log shows **every** trade since the first journal and exploration accounts for the same.

**Example**
```js
if(CMDR.Credits > 500) {
  console.log("Wow! You are Rich!");
}
```

### CMDR
###### Profile
`CMDR.Name`
`CMDR.Credits`

###### Location
`CMDR.Location`
`CMDR.System`
`CMDR.Security`

###### Ship
`CMDR.Ship`
`CMDR.ShipID`
`CMDR.ShipName`

###### Pilot Rank
`CMDR.CombatRank`
`CMDR.CombatProgress`
`CMDR.TradeRank`
`CMDR.TradeProgress`
`CMDR.ExploreRank`
`CMDR.ExploreProgress`

###### Faction Rank
`CMDR.FederationRank`
`CMDR.FederationProgress`
`CMDR.EmpireRank`
`CMDR.EmpireProgress`

### BOUNTIES
`BOUNTIES.Target`
`BOUNTIES.Reward`

### TRADING
`TRADING.timeStamp`
`TRADING.buySell`
`TRADING.type`
`TRADING.count`
`TRADING.priceSold`
`TRADING.pricePaid`
`TRADING.total`

### EXPLORATION
`EXPLORATION.timeStamp`
`EXPLORATION.starSystem`
`EXPLORATION.dist`
`EXPLORATION.economy`
`EXPLORATION.government`
`EXPLORATION.security`

# Missing Data
I'm aware that not **ALL** information from the journals is available right now, if you're willing to help set this data up in the main.js file please feel free to, otherwise it all depends on when I can get time to update the holders to take in the information.
