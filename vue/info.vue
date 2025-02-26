<template>
  <div class="container">
    <div class="item">
      <h4>Current Device:</h4>
      <p>UpTime: {{uptime_s}}s</p>
      <p>Build: {{build}}</p>
      <p>IP Address: {{ip}}</p>
      <p>MAC Address: {{mac}}</p>
      <p>MQTT Server: {{mqtthost}}</p>
      <p>MQTT Topic: {{mqtttopic}}</p>
      <p>WEBAPP Url root: {{webapp}}</p>
      <p>Chipset: {{chipset}}</p>
      <p v-if="error">Error: {{error}}</p>
    </div>

    <div class="item" v-if="supportsClientDeviceDB" style="width: 300px;">
      <h4>Devices:</h4>
      Chipset:
      <select v-model="selectedChipset">
        <option v-for="chip in chipsets" :value="chip" :key="chip">{{chip}}</option>
      </select>
      {{ (filteredDevices || []).length - 1 }} devices
      <br/><br/>

      <select v-model="selectedDevice" style="width: 250px;">
        <option v-for="dev in filteredDevices" :value="dev" :key="dev">{{ getDeviceDisplayName(dev) }}</option>
      </select>

      <div>
        <device :selected-device="selectedDevice" style="margin: 10px 0"></device>
        <div v-if="selectedDevice">
          <button @click="useDevice">Copy Device Settings</button>
        </div>
        <div v-else>Pick a device from the dropdown.</div>
      </div>
    </div>

    <div class="item">
      <h4>Pin Settings:</h4>
      <div v-for="(role, index) in pins.roles" :key="index">
        <span>{{index}}</span>
        <select v-model="pins.roles[index]">
          <option v-for="(name, index2) in pins.rolenames" :value="index2" :key="index2" :selected="(role == index2)">{{name}}</option>
        </select>
        <input type="number" min="0" max="32" step="1" v-model="pins.channels[index]">
      </div>

      <br/>
      <label for="deviceFlag" style="width:75px; display: inline-block;">Flag:</label>&nbsp;<input id="deviceFlag" v-model="deviceFlag" /><br/>
      <label for="deviceCommand" style="width:75px; display: inline-block;">Command:</label>&nbsp;<input id="deviceCommand" v-model="deviceCommand" placeholder="Startup command"/><br/>

      <button @click="savePins">Save Pins</button>
    </div>
  </div>
</template>

<script>
  module.exports = {
    components: {
      'device': window.getComponent('device')
    },
    data: ()=>{
      return {
        uptime_s: 0,
        build:'unknown',
        sys:'unknown',
        ip:'unknown',
        mac:'unknown',
        mqtthost:'unknown',
        mqtttopic:'unknown',
        webapp:'unknown',
        chipset:'unknown',
        supportsClientDeviceDB: false,

        pins:{ rolenames:[], roles:[], channels:[] },
        deviceFlag:"",
        deviceCommand: "",

        error:'',
        interval: null,

        devices: null,
        selectedDevice: null,
        chipsets:[
          "All","BK7231N","BK7231S","BK7231T","BL602", "XR809", "W800", "W600"
        ],
        selectedChipset: "All",
        pinRoleNames: [
          " ",
          "Relay",
          "Relay_n",
          "Button",
          "Button_n",
          "LED",
          "LED_n",
          "PWM",
          "WifiLED",
          "WifiLED_n",
          "Btn_Tgl_All",
          "Btn_Tgl_All_n",
          "dInput",
          "dInput_n",
          "TglChanOnTgl",
          "dInput_NoPullUp",
          "dInput_NoPullUp_n",
          "BL0937SEL",
          "BL0937CF",
          "BL0937CF1",
          "ADC",
          "SM2135DAT",
          "SM2135CLK",
          "BP5758D_DAT",
	        "BP5758D_CLK",
          "BP1658CJ_DAT",
	        "BP1658CJ_CLK",
        	"PWM_n"
        ]
      }
    },
    computed:{
      /* Returns devices filtered by chipset */
      filteredDevices(){
        if (this.selectedChipset === "All") { return this.devices; }

        //The first value is empty value
        var list = this.devices.filter(item => item === null || item.chip === this.selectedChipset);
        return list;
      }
    },
    methods:{
      getinfo(){
        let url = window.device+'/api/info';
        fetch(url)
            .then(response => response.json())
            .then(res => {
                this.uptime_s   = res.uptime_s;
                this.build      = res.build;
                this.sys        = res.sys;
                this.ip         = res.ip;
                this.mac        = res.mac;
                this.mqtthost   = res.mqtthost;
                this.mqtttopic  = res.mqtttopic;
                this.webapp     = res.webapp;
                this.chipset    = res.chipset;
                this.supportsClientDeviceDB = res.supportsClientDeviceDB;
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!

      },
      getPins(){
        let url = window.device+'/api/pins';
        fetch(url)
            .then(response => response.json())
            .then(res => {
              this.pins = res;
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!

      },
      savePins() {
        let tosave = {};

        //Send more data pieces conditionally to prevent errors
        if (this.supportsClientDeviceDB) {
          //Valid deviceFlag is >=0 and <=10 (see new_pins.h)
          if (this.deviceFlag){ //Check flag value if populated
            var deviceFlagParsed = parseInt(this.deviceFlag, 10);
            if (!isFinite(deviceFlagParsed) || isNaN(deviceFlagParsed) || (deviceFlagParsed < 0) || (deviceFlagParsed > 10)){
              alert("Invalid flag value. Valid values are integers >= 0 and <= 10");
              return;
            }
          }

          tosave.deviceFlag = deviceFlagParsed;

          //Only send non-empty string value
          var deviceCommandParsed = (this.deviceCommand || "").trim();
          if (deviceCommandParsed){
            tosave.deviceCommand = deviceCommandParsed;
          }
        }

        for (let i = 0; i < this.pins.channels.length; i++){
          this.pins.channels[i] = +this.pins.channels[i];
        }
        for (let i = 0; i < this.pins.roles.length; i++){
          this.pins.roles[i] = +this.pins.roles[i];
        }
        tosave.channels = this.pins.channels;
        tosave.roles = this.pins.roles;

        let url = window.device+'/api/pins';
        fetch(url, {
                method: 'POST',
                body: JSON.stringify(tosave),
            })
            .then(response => response.json())
            .then(res => {
              this.error = JSON.stringify(res);
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!

        console.log('would save',this.pins);
      },
      getRoleIndex(role){
        return this.pinRoleNames.indexOf(role);
      },
      useDevice(){
        if (this.selectedDevice === null){ //No device was selected, keep current pin values
          return;
        }

        var newPinsRoles = [];
        var newPinsChannels = [];
        for (let i = 0; i < this.pins.roles.length; i++){
          newPinsRoles.push(0);
          newPinsChannels.push(0);
        }

        var devicePins = this.selectedDevice.pins;
        for(let pin in devicePins){
          let roleChannel = devicePins[pin].split(";");

          newPinsRoles[pin]=this.getRoleIndex(roleChannel[0].trim());
          newPinsChannels[pin] = roleChannel[1].trim();
        }

        this.pins.roles = newPinsRoles;
        this.pins.channels = newPinsChannels;
        this.deviceFlag = this.selectedDevice.flag || "";
        this.deviceCommand = this.selectedDevice.command || "";
      },
      getDevices(){
        fetch(window.root + "devices.json")
          .then(response => response.json())
          .then(data => {
            this.devices = data.devices.sort((a,b) => {
              const nameA = this.getDeviceDisplayName(a).toLowerCase();
              const nameB = this.getDeviceDisplayName(b).toLowerCase();
              return nameA < nameB ? -1 : (nameA > nameB ? 1: 0);
            });

            this.devices.unshift(null); //Empty placeholder
          })
          .catch(err => {
              this.error = err.toString();
              console.error(err)
            });
      },
      getDeviceDisplayName(dev){
        //The first option is a placeholder with null value
        return dev ? dev.vendor + " " + dev.name : "";
      }
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted controller');
        this.getPins();
        this.getinfo();
        this.getDevices();
        this.interval = setInterval(()=>{
          this.getinfo();
        }, 10000);
    },
    destroyed(){
      clearInterval(this.interval);
    }

  }
//@ sourceURL=/vue/info.vue
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
  }

  .item {
    padding: 0 10px 0 10px;
  }
</style>
