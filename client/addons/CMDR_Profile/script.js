//EXAMPLE JAVASCRIPT FILE
document.getElementById('profileNAME').innerHTML = '<small>CMDR</small> <strong>' + Capital(CMDR.Name) + '</strong>';
document.getElementById('profileBALANCE').innerHTML = PrettyCredits();

document.getElementById('profileSHIP').innerHTML = Capital(CMDR.Ship);
document.getElementById('profileSHIPNAME').innerHTML = Capital(CMDR.ShipName);
document.getElementById('profileSHIPID').innerHTML = Capital(CMDR.ShipID);

document.getElementById('CombatTitle').innerHTML = "<strong>Combat</strong> - " + CMDR.CombatRank;
document.getElementById('CombatProgress').style.width = CMDR.CombatProgress + "%";
document.getElementById('TradeTitle').innerHTML = "<strong>Trade</strong> - " + CMDR.TradeRank;
document.getElementById('TradeProgress').style.width = CMDR.TradeProgress + "%";
document.getElementById('ExploreTitle').innerHTML = "<strong>Explorer</strong> - " + CMDR.ExploreRank;
document.getElementById('ExploreProgress').style.width = CMDR.ExploreProgress + "%";

document.getElementById('FederationTitle').innerHTML = "<strong>Federation</strong> - " + CMDR.FederationRank;
document.getElementById('FederationProgress').style.width = CMDR.FederationProgress + "%";
document.getElementById('EmpireTitle').innerHTML = "<strong>Empire</strong> - " + CMDR.EmpireRank;
document.getElementById('EmpireProgress').style.width = CMDR.EmpireProgress + "%";

function PrettyCredits() {
  return CMDR.Credits.toLocaleString() + "CR";
}

function Capital(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
