/*
THE CORE.JS SCRIPT HANDLES SENDING AND RECEIVING INFORMATION
THROUGH SOCKET.IO, THE MAIN PROFILE IS SAVED TO CMDR AND IS
ONLY UPDATED EVERY SO OFTEN WHERE AS THINGS LIKE EXPLORATION,
COMBAT AND TRADING ARE UPDATED MORE FREQUENTLY

THEY ARE SPLIT INTO THEIR OWN VARIABLES TO HELP KEEP THEM AS
ACCURATE AS POSSIBLE AND EASIER TO MANIPULATE
*/
  var socket = io();

  var CMDR;
  var BOUNTIES = [];
  var EXPLORATION = [];
  var TRADING = [];

  socket.on('disconnect', function() {
    //THIS WILL BE WHERE WE DISPLAY A DISCONNECTED STATUS
  });

  socket.on('cmdrData', function(data) {
    CMDR = ({
      Name: data.name,
      Credits: data.credits,

      Location: data.location,
      System: data.system,
      Security: data.security,

      Ship: data.ship,
      ShipID: data.shipid,
      ShipName: data.shipname,

      CombatRank: data.combatRank,
      CombatProgress: data.combatProgress,

      TradeRank: data.tradeRank,
      TradeProgress: data.tradeProgress,

      ExploreRank: data.exploreRank,
      ExploreProgress: data.exploreProgress,

      EmpireRank: data.empireRank,
      EmpireProgress: data.empireProgress,

      FederationRank: data.federationRank,
      FederationProgress: data.federationProgress
    });
  });

  socket.on('bountyData', function(data) {
    BOUNTIES = data;
  });

  socket.on('exploreData', function(data) {
    EXPLORATION = data;
  });

  socket.on('tradeData', function(data) {
    TRADING = data;
  });
