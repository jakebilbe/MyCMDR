const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  electron
} = require('electron');
var config = require('./config');
const path = require('path');
const url = require('url');
var mainWin = null;
var settingsWin = null;
var tray = null;
var express = require('express');
var exp = express();
var ip = require('ip');
var serv = require('http').Server(exp);
var fs = require('fs');
var journalDir = process.env.USERPROFILE + config.path;

var SOCKET;
var CMDR;
var EXPLORE = [];
var BOUNTIES = [];
var MARKET = [];
var CHATLOG = [];
var TIMESINCE = 0;

var fileIndex = 0;
var lineIndex = 0;

var CombatRanks = ["Harmless", "Mostly Harmless", "Novice", "Competent", "Expert", "Master", "Dangerous", "Deadly", "Elite"]
var TradeRanks = ["Penniless", "Mostly Penniless", "Peddler", "Dealer", "Merchant", "Broker", "Entrepreneur", "Tycoon", "Elite"]
var ExploreRanks = ["Aimless", "Mostly Aimless", "Scout", "Surveyor", "Trailblazer", "Pathfinder", "Ranger", "Pioneer", "Elite"]
var EmpireRanks = ["None", "Outsider", "Serf", "Master", "Squire", "Knight", "Lord", "Baron", "Viscount", "Count", "Earl", "Marquis", "Duke", "Prince", "King"]
var FederationRanks = ["None", "Recruit", "Cadet", "Midshipman", "Petty Officer", "Chief Petty Officer", "Warrant Officer", "Ensign", "Lieutenant", "Lieutenant Commander", "Post Commander", "Post Captain", "Rear Admiral", "Vice Admiral", "Admiral"]

//ELECTRON WINDOW
app.on('ready', function() {
  var mainScreen = require('electron').screen.getPrimaryDisplay();
  mainWin = new BrowserWindow({
    width: config.width,
    height: config.height,
    frame: false,
    show: false,
    icon: __dirname + '/app.ico'
  })
  mainWin.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  mainWin.setMenu(null);
  mainWin.setPosition(mainScreen.bounds.width - config.width - 10, mainScreen.bounds.height - config.height - 50);
  mainWin.webContents.on('did-finish-load', function() {
    mainWin.show();
  });
  mainWin.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });

  tray = new Tray(__dirname + '/app.ico');
  tray.setToolTip('MyCMDR');
  tray.on('click', function(event) {
    if (mainWin.isVisible()) {
      mainWin.hide();
    } else {
      mainWin.show();
    }
  });
});
app.on('minimize', function(event) {
  event.preventDefault()
  mainWin.hide();
});
app.on('close', function(event) {
  if (!application.isQuiting) {
    mainWin.forceClose = true;
  }
  return false;
});
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    tray.destroy();
    app.quit();
  }
});
//ELECTRON WINDOW

//SERVER
exp.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
exp.use('/client', express.static(__dirname + '/client'));
serv.listen(config.port);
var io = require('socket.io')(serv, {});
//SERVER

//HOLDER FOR CMDR DATA
var Cmdr = function() {
  var self = {
    timesince: 0,
    name: "none",
    credits: 0,
    location: "",
    system: "",
    security: "",
    ship: "",
    shipid: "",
    shipname: "",

    combatRank: "",
    combatProgress: 0,
    tradeRank: "",
    tradeProgress: 0,
    exploreRank: "",
    exploreProgress: 0,
    empireRank: "",
    empireProgress: 0,
    federationRank: "",
    federationProgress: 0
  }
  return self;
}

//CALLED ON APP STARTUP
Cmdr.Create = function() {
  CMDR = Cmdr();
  CMDR.timesince = TIMESINCE;
  ReadJournals();
}

//CALLED WHEN A CLIENT CONNECTS
Cmdr.OnConnect = function() {
  if (SOCKET != null) {
    SOCKET.emit('DataPack', CMDR);
    SOCKET.emit('tradeData', MARKET);
  }
}

//CALLED IN INTERVAL TO UPDATE CMDR
Cmdr.Update = function() {
  CMDR.timesince = TIMESINCE;
  ReadJournals();
}

//READ EVERY FILE IN JOURNAL FOLDER
function ReadJournals() {
  //PLACE ALL FILES IN AN ARRAY
  var FileNames = [];
  fs.readdirSync(journalDir).forEach(file => {
    FileNames.push(file);
  });

  for (var i = 0; i < FileNames.length; i++) {
    //IF FILE IS NEWER THAN INDEXED
    if (i > fileIndex) {
      fileIndex = i; //SET INDEX TO NEW FILE
      lineIndex = 0; //RESET LINE INDEX
    }
    //READ INDEXED FILE
    ReadLines(FileNames[fileIndex]);
  }
}

function ReadLines(data) {
  //SPLIT EVERY ENTRY IN THE FILE UP INTO AN ARRAY
  var lines = require('fs').readFileSync((journalDir + data), 'utf-8').split('\n').filter(Boolean);

  for (var i = 0; i < lines.length; i++) {
    //IF CURRENT ENTRY IS OLDER THAN INDEXED, CONTINUE
    if (i <= lineIndex)
      continue;
    //IF CURRENT ENTRY IS NEWER THAN INDEXED, CHANGE INDEX
    if (i > lineIndex)
      lineIndex = i;
    var obj = JSON.parse(lines[i]);

    //PROFILE
    if (obj.event === "LoadGame") {
      CMDR.name = obj.Commander;
      CMDR.credits = obj.Credits;
      CMDR.ship = obj.Ship;
      CMDR.shipid = obj.ShipIdent;
      CMDR.shipname = obj.ShipName;
    }
    if (obj.event === "Rank") {
      CMDR.combatRank = CombatRanks[obj.Combat];
      CMDR.tradeRank = TradeRanks[obj.Trade];
      CMDR.exploreRank = ExploreRanks[obj.Explore];
      CMDR.empireRank = EmpireRanks[obj.Empire];
      CMDR.federationRank = FederationRanks[obj.Federation];
    }
    if (obj.event === "Progress") {
      CMDR.combatProgress = obj.Combat;
      CMDR.tradeProgress = obj.Trade;
      CMDR.exploreProgress = obj.Explore;
      CMDR.empireProgress = obj.Empire;
      CMDR.federationProgress = obj.Federation;
    }
    if (obj.event === "Loadout") {
      CMDR.ship = obj.Ship;
      CMDR.shipid = obj.ShipIdent;
      CMDR.shipname = obj.ShipName;
    }
    if (obj.event === "SetUserShipName") {
      CMDR.ship = obj.Ship;
      CMDR.shipid = obj.UserShipId;
      CMDR.shipname = obj.UserShipName;
    }

    //SYSTEM
    if (obj.event === "Location" || obj.event === "FSDJump" || obj.event === "SupercruiseExit") {
      CMDR.system = obj.StarSystem;
      CMDR.location = obj.Body;
      if (obj.SystemSecurity_Localised)
        CMDR.security = obj.SystemSecurity_Localised;
    }

    if (obj.event === "FSDJump")
      AddToExplore(obj);

    //COMBAT
    if (obj.event == "Bounty") {
      AddToBounties(obj);
    }
    if (obj.event === "RedeemVoucher" && obj.Type === "bounty") {
      CMDR.credits += obj.Amount;
      BOUNTIES = [];
    }

    //CREDITS
    if (obj.event === "CrewHire" || obj.event === "RefuelAll" || obj.event === "RepairAll" || obj.event === "RestockVehicle") {
      CMDR.credits -= obj.Cost;
    }
    if (obj.event === "ModuleBuy") {
      if (obj.SellPrice)
        CMDR.credits += obj.SellPrice;
      if (obj.BuyPrice)
        CMDR.credits -= obj.BuyPrice;
    }
    if (obj.event === "MarketBuy") {
      CMDR.credits -= obj.TotalCost;
      AddToMarket(obj);
    }
    if (obj.event === "MarketSell") {
      CMDR.credits += obj.TotalSale;
      AddToMarket(obj);
    }

    //CHAT
    if (obj.event === "ReceiveText") {
      if (SOCKET != null)
        SOCKET.emit('chatLOG', {
          from: obj.From_Localised,
          msg: obj.Message_Localised,
          chan: obj.Channel,
        });
    }
  }
}

function AddToExplore(obj) {
  var match = false;
  for (var i = 0; i < EXPLORE.length; i++) {
    if (EXPLORE[i].timeStamp === obj.timestamp)
      match = true;
  }

  if (match === false) {
    EXPLORE.push({
      timeStamp: obj.timestamp,
      starSystem: obj.StarSystem,
      dist: obj.JumpDist,
      economy: obj.SystemEconomy_Localised,
      government: obj.SystemGovernment_Localised,
      security: obj.SystemSecurity_Localised,
    });
  }
}

function AddToBounties(obj) {
  var match = false;
  for (var i = 0; i < BOUNTIES.length; i++) {
    if (BOUNTIES[i].timeStamp === obj.timestamp)
      match = true;
  }

  if (match === false) {
    BOUNTIES.push({
      timeStamp: obj.timestamp,
      target: obj.Target,
      reward: obj.TotalReward,
    });
  }
}

function AddToMarket(obj) {
  var match = false;
  for (var i = 0; i < MARKET.length; i++) {
    if (MARKET[i].timeStamp == obj.timestamp)
      match = true;
  }

  if (match === false) {
    if (obj.event === "MarketBuy") {
      MARKET.push({
        timeStamp: obj.timestamp,
        buySell: obj.event,
        type: obj.Type,
        count: obj.Count,
        priceSold: 0,
        pricePaid: obj.BuyPrice,
        total: obj.TotalSale
      });
    }

    if (obj.event === "MarketSell") {
      MARKET.push({
        timeStamp: obj.timestamp,
        buySell: obj.event,
        type: obj.Type,
        count: obj.Count,
        priceSold: obj.SellPrice,
        pricePaid: obj.AvgPricePaid,
        total: obj.TotalSale
      });
    }
  }
}

Cmdr.Create();
io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function() {
    SOCKET = null;
  });
  if (SOCKET != null)
    socket.disconnect();
  SOCKET = socket;
  Cmdr.OnConnect();
});

global.isUserConnected = function() {
  if (SOCKET != null)
    return true;
  return false;
}

global.forceDisconnect = function() {
  if (SOCKET != null) {
    SOCKET.disconnect();
    SOCKET = null;
  }
}

setInterval(function() {
  TIMESINCE++;
  Cmdr.Update();

  if (isUserConnected()) {
    tray.setToolTip('MyCMDR - Connected');
  } else {
    tray.setToolTip('MyCMDR - Disconnected');
  }

  if (SOCKET != null) {
    SOCKET.emit('cmdrData', CMDR);
    SOCKET.emit('exploreData', EXPLORE);
    SOCKET.emit('bountyData', BOUNTIES);
    SOCKET.emit('tradeData', MARKET);
  }
}, 1000);
