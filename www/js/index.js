/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
   
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },


      // Update DOM on a Received Event
    receivedEvent: function(id) {
//  this.receivedEvent('deviceready');
    document.getElementById("btnStatus").disabled=false;
    document.getElementById("btnToggle").disabled=false; 
    document.getElementById("btnStatus").addEventListener("click", app.checkStatus);
    document.getElementById("btnToggle").addEventListener("click", app.toggleStatus);
    document.getElementById("refreshButton").addEventListener("click", app.populateDevices);
    document.getElementById("btnON").addEventListener("click", app.switchBlubOn);
    document.getElementById("btnOFF").addEventListener("click", app.switchBlubOff);
    document.getElementById("btnBack").addEventListener("click", app.backToMain);
    document.getElementById("commandPage").style.display="none";
    //Set event listener for every device
  /*  var elements = document.getElementsByClassName("box");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', app.deviceClick, false);
    }
*/
   
    document.getElementById("deviceList").addEventListener("touchstart", app.connect);

    var openbtn = document.getElementById('openbtn');

    if(openbtn){
        openbtn.addEventListener('click',  app.openNav, false);
    }

    var closebtn = document.getElementById('closebtn');
    if(closebtn){
        closebtn.addEventListener('click',  app.closeNav, false);

    //enable bluetooth radio if not
   
    cordova.plugins.diagnostic.isBluetoothEnabled(function(enabled){
     if (!enabled) {
            app.setStatus("Enabling Bluetooth Radio....");
            app.enableBluetoothRadio();
     }
     else
     {       app.setStatus("Populating available lights near by....");
             app.refreshDeviceList(); 
     }
  
    }, function(error){
        app.setStatus("The following error occurred: "+error);
    });    
   }  
   
   
},

deviceClick: function(){
    alert("Clicked");
},

checkStatus: function(){         
        cordova.plugins.diagnostic.isBluetoothEnabled(function(enabled){
             if (enabled) {
                 document.getElementById("btnToggle").innerHTML="Disable Bluetooth"; 
                
             } else {
                 //app.setStatus("Bluetooth is disbaled please enable it");
                 document.getElementById("btnToggle").innerHTML="Enable Bluetooth"; 
             }
         }, function(error){
             app.setStatus("The following error occurred: "+error);
         }); 
},
 
enableBluetoothRadio:function(){
        cordova.plugins.diagnostic.setBluetoothState(function(){
            console.log("Bluetooth was enabled");
            document.getElementById("btnToggle").innerHTML="Disable Bluetooth"
        }, 
        function(error){
            alert(error);
           console.error("The following error occurred: "+error);
        },true);
},

    toggleStatus:function(){
         if(document.getElementById("btnToggle").innerHTML=="Enable Bluetooth")
         {   
             cordova.plugins.diagnostic.setBluetoothState(function(){
                 console.log("Bluetooth was enabled");
                 document.getElementById("btnToggle").innerHTML="Disable Bluetooth"
             }, 
             function(error){
                 alert(error);
                console.error("The following error occurred: "+error);
             },true);
              
         }
             else
             {
                 if(document.getElementById("btnToggle").innerHTML=="Disable Bluetooth") 
                 {
                     cordova.plugins.diagnostic.setBluetoothState(function(){
                         console.log("Bluetooth was disabled");
                         document.getElementById("btnToggle").innerHTML="Enable Bluetooth"
                     }, 
                     function(error){
                        
                         
                        console.error("The following error occurred: "+error);
                     },false);
                 }
             }
                      
     },  

    handleError: function(error){
        var msg = "Error: "+error;
        app.setStatus(msg);
        alert(msg);
    },
    setStatus: function(status){
        document.getElementById("messageDiv").innerHTML=status; 
    },

    populateDevices: function(event) {
            deviceList.firstChild.innerHTML = "Discovering...";
            app.setStatus("Looking for Bluetooth Devices...");
            
            bluetoothSerial.list(app.ondevicelist, app.generateFailureFunction("List Failed"));
        },
        ondevicelist: function(devices) {
            var listItem, deviceId;
    
            // remove existing devices
            deviceList.innerHTML = "";
            app.setStatus("");
            
            devices.forEach(function(device) {
                listItem = document.createElement('li');
                listItem.className = "topcoat-list__item";
                if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                    deviceId = device.uuid;
                } else if (device.hasOwnProperty("address")) {
                    deviceId = device.address;
                } else {
                    deviceId = "ERROR " + JSON.stringify(device);
                }
                listItem.setAttribute('deviceId', device.address);            
                listItem.innerHTML = device.name + "<br/><i>" + deviceId + "</i>";
                deviceList.appendChild(listItem);
            });
    
            if (devices.length === 0) {
                
                if (cordova.platformId === "ios") { // BLE
                    app.setStatus("No Bluetooth Peripherals Discovered.");
                } else { // Android
                    app.setStatus("Please Pair a Bluetooth Device.");
                }
    
            } else {
                app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
            }
        },

        populateUnpaired: function()
        {
            var listItem, deviceId;
    
            // remove existing devices
            deviceList.innerHTML = "";
            app.setStatus("");

            bluetoothSerial.discoverUnpaired(function(devices) {
                devices.forEach(function(device) {
                    listItem = document.createElement('li');
                    listItem.className = "topcoat-list__item";
                    if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                        deviceId = device.uuid;
                    } else if (device.hasOwnProperty("address")) {
                        deviceId = device.address;
                    } else {
                        deviceId = "ERROR " + JSON.stringify(device);
                    }
                    listItem.setAttribute('deviceId', device.address);            
                    listItem.innerHTML = device.name + "<br/><i>" + deviceId + "</i>";
                    deviceList.appendChild(listItem);
                })
            }, app.generateFailureFunction("List Failed"));
            
        },
        generateFailureFunction: function(message) {
            var func = function(reason) {
                var details = "";
                if (reason) {
                    details += ": " + JSON.stringify(reason);
                }
                app.setStatus(message + details);
            };
            return func;
        },
        
        openNav:function(){
           
            document.getElementById("mySidebar").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
        },

         closeNav: function() {
            document.getElementById("mySidebar").style.width = "0";
            document.getElementById("main").style.marginLeft= "0";
        },

        /* Refresh paired bluetooth devices */
        refreshDeviceList: function() {
            
            bluetoothSerial.list(app.onDeviceList, app.onError);
        },

        onDeviceList: function(devices) {
            var option;
            var deviceList=document.getElementById("deviceList");
            // remove existing devices
            deviceList.innerHTML = "";
            app.setStatus("");    
            devices.forEach(function(device) {
                var listItem = document.createElement('li');
                listItem.className="grid-item";
                if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                    deviceId = device.uuid;
                } else if (device.hasOwnProperty("address")) {
                    deviceId = device.address;
                } else {
                    deviceId = "ERROR " + JSON.stringify(device);
                }
                listItem.setAttribute('deviceId', device.address);            
                listItem.innerHTML = "<img src='img/bulb.png'/><br/>" +  device.name + "<br/><i>" + deviceId + "</i>";
                deviceList.appendChild(listItem);
                
               // listItem.setAttribute('deviceId', device.address);   
              //  html = "<div class='box'><img src='img/bulb.png'></img><div>" + device.name +  "</div></div>";
    
              //  listItem.innerHTML = html;
                
                if (cordova.platformId === 'windowsphone') {
                  // This is a temporary hack until I get the list tap working
                  var button = document.createElement('button');
                  button.innerHTML = "Connect";
                  button.addEventListener('click', app.connect, false);
                  button.dataset = {};
                  button.dataset.deviceId = device.id;
                  listItem.appendChild(button);
                } else {
                  listItem.dataset.deviceId = device.id;
                }
                deviceList.appendChild(listItem);
              
            });
    
            if (devices.length === 0) {
    
                option = document.createElement('option');
                option.innerHTML = "No Bluetooth Devices";
                deviceList.appendChild(option);
    
                if (cordova.platformId === "ios") { // BLE
                    app.setStatus("No Bluetooth Peripherals Discovered.");
                } else { // Android or Windows Phone
                    app.setStatus("Please Pair a Bluetooth Device.");
                }
    
            } else {
                app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
            }
    
        },

        /* Connect and Disconnect Functions Goes here */

        connect: function (e) {
                     
            var device = e.target.getAttribute('deviceId');
            app.setStatus("Requesting connection to " + device);          
            document.getElementById("deviceName").innerHTML="Device: " + device; 
            bluetoothSerial.connect(device, app.onconnect, app.ondisconnect);        
        },

        disconnect: function(event) {
            if (event) {
                event.preventDefault();
            }
    
            app.setStatus("Disconnecting...");
            bluetoothSerial.disconnect(app.ondisconnect);
        },
        onconnect: function() {            
           
            app.setStatus("Connected");
                  
            app.showCommandPage();
        },

        ondisconnect: function() {         
            app.setStatus("Disconnected.");
        },

        /* Connect and Disconnect Functions ends here */

        // Send command to device

        sendToArduino: function(c) {
            bluetoothSerial.write("c" + c + "\n");
        },

        showCommandPage:function(){
            document.getElementById("main").style.display="none";
            document.getElementById("top-nav").style.display="block"; 
            document.getElementById("commandPage").style.display="block";    
           // var device = e.target.getAttribute('deviceId');       
           // app.setStatus(device);            
        },

        backToMain: function(){
            app.disconnect();
            document.getElementById("main").style.display="block";
            document.getElementById("top-nav").style.display="none"; 
            document.getElementById("commandPage").style.display="none"; 
        },

        switchBlubOn:function(){
           
            app.sendToArduino('1');      
            document.getElementById("lightStatus").innerHTML="Light ON";      
        },

        switchBlubOff:function(){            
            app.sendToArduino('0');  
            document.getElementById("lightStatus").innerHTML="Light OFF";          
        },



        showMainPage: function() {
            mainPage.style.display = "";
            detailPage.style.display = "none";
        },
        showDetailPage: function() {
            mainPage.style.display = "none";
            detailPage.style.display = "";
        },
        setStatus: function(message) {
            console.log(message);
    
            window.clearTimeout(app.statusTimeout);
            statusDiv.innerHTML = message;
            statusDiv.className = 'fadein';
    
            // automatically clear the status with a timer
            app.statusTimeout = setTimeout(function () {
                statusDiv.className = 'fadeout';
            }, 5000);
        },
        onError: function(reason) {
            alert("ERROR: " + reason); // real apps should use notification.alert
        }
};

app.initialize();


            

         