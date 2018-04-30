/*
THE ADDONS.JS SCRIPT HANDLES RETRIEVING THE ADDONS SENT FROM THE
NODE APPLICATION, THIS WILL SET UP ALL CSS, HTML AND SCRIPT FILES
ALONG WITH CREATING THE APPROPRIATE ELEMENTS ON THE CLIENT AND
SETTING UP THE MENU TO NAVIGATE THEM ALL.
*/

//HOLDER FOR ALL MENU ELEMENTS
var MENUS = [];

//STORE A REFERENCE TO THE CSS ELEMENT
var CSS = document.createElement('style');
document.getElementsByTagName('head')[0].appendChild(CSS);

//STORE A REFERENCE TO THE HTML CONTAINER
var HTML = document.createElement('div');
HTML.id = "ADDON-CONTAINER";
document.getElementsByTagName('body')[0].appendChild(HTML);

//THIS DATA PACK IS RECEIVED WHEN THE CLIENT CONNECTS
socket.on('addonData', function(data) {
  //CREATE CSS, HTML AND JAVASCRIPT ELEMENTS
  for (var i = 0; i < data.length; i++) {
    CSS.innerHTML += data[i].css;

    var html = document.createElement('div');
    html.id = data[i].title;
    html.innerHTML = data[i].html;
    html.style.display = "none";
    HTML.appendChild(html);
    MENUS.push(html);

    var js = document.createElement('script');
    js.src = data[i].js;
    document.getElementsByTagName('html')[0].appendChild(js);
  }

  //SETUP MENU ITEMS IN NAVBAR
  var menuBAR = document.getElementById('menuBAR');
  for (var i = 0; i < MENUS.length; i++) {
    var a = document.createElement('a');
    a.href = 'javascript:ChangeMenu("' + MENUS[i].id + '")';
    a.classList.add("nav-link");
    a.innerHTML = MENUS[i].id;

    var li = document.createElement('li');
    li.classList.add("nav-item");
    li.appendChild(a);

    menuBAR.appendChild(li);
  }

  //ACTIVATE THE FIRST ADDON
  ChangeMenu(data[0].title);
});

function ChangeMenu(name) {
  for (var i = 0; i < MENUS.length; i++) {
    if (name == MENUS[i].id) {
      MENUS[i].style.display = "block";
    } else {
      MENUS[i].style.display = "none";
    }
  }
}

function reloadAddons() {
  socket.emit('reloadAddons');
}

socket.on('addonsReloaded', function() {
  location.reload();
})
