<template>
    <div class="container">
      <div class="left">
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

      <div class="right">
        <table width="100%">
          <tr>
            <td style="vertical-align:top; padding-right:5px; width: 250px;">
              <p>Devices:</p>

              <select v-model="selectedDevIndex">
                <option v-for="(dev, index) in devices" :value="index" :key="index">{{dev.name}}</option>
              </select>

              <div v-if="selectedDevIndex>0">
                {{ devices[selectedDevIndex].chip}} {{ devices[selectedDevIndex].board }}

                <div v-if="devices[selectedDevIndex].urls">
                  More Info: 
                  <span v-for="(url,index) in devices[selectedDevIndex].urls" :key="url">
                    <a v-bind:href="url" target="_blank">{{index+1}}</a>
                  </span>
                </div>

                <ul>
                  <li v-for="(pin,key) in devices[selectedDevIndex].pins" :key="key">
                  Pin {{key}} as {{ pin.split(';')[0] }} on channel {{ pin.split(';')[1] }}
                  </li>
                </ul>
                <button @click="useDevice">Use device</button>
              </div>
              
            </td>
            <td style="vertical-align:top; padding-left:5px;">

              <p>Pin Settings:</p>
              <div v-for="(role, index) in pins.roles" :key="index">
                <span>{{index}}</span>
                <select v-model="pins.roles[index]">
                  <option v-for="(name, index2) in pins.rolenames" :value="index2" :key="index2" :selected="(role == index2)">{{name}}</option>
                </select>
                <input type="number" min="0" max="32" step="1" v-model="pins.channels[index]">
              </div>
              <button @click="savePins">Save Pins</button>
              
            </td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script>
  module.exports = {
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

        pins:{ rolenames:[], roles:[], channels:[] },

        error:'',
        interval: null,

        devices: null,
        selectedDevIndex: 0,
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
          "SM2135CLK"
        ]
      }
    },
    methods:{
      onDeviceSelected(event){
      },
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
        for (let i = 0; i < this.pins.channels.length; i++){
          this.pins.channels[i] = +this.pins.channels[i];
        }
        for (let i = 0; i < this.pins.roles.length; i++){
          this.pins.roles[i] = +this.pins.roles[i];
        }
        let tosave = {
          channels: this.pins.channels,
          roles: this.pins.roles,
        }
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
        if (this.selectedDevIndex===0){ //Nothing was selected, first item is empty
          return;
        }

        var newPinsRoles = [];
        var newPinsChannels = [];
        for (let i = 0; i < this.pins.roles.length; i++){
          newPinsRoles.push(0);
          newPinsChannels.push(0);
        }

        var devicePins = this.devices[this.selectedDevIndex].pins;
        for(let pin in devicePins){
          let roleChannel = devicePins[pin].split(";");

          newPinsRoles[pin]=this.getRoleIndex(roleChannel[0].trim());
          newPinsChannels[pin] = roleChannel[1].trim();
        }

        this.pins.roles = newPinsRoles;
        this.pins.channels = newPinsChannels;
      },
      getDevices(){
        fetch("devices.json")
          .then(response => response.json())
          .then(data => {
            this.devices = data.sort((a,b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              return nameA < nameB ? -1 : (nameA > nameB ? 1: 0);
            });
          })
          .catch(err => {
              this.error = err.toString();
              console.error(err)
            });
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
    position:relative;
  }

  .left {
    position:absolute;
    left:0;
    top:0;
    width:50%;
  }  

  .right {
    position:absolute;
    left:50%;
    top:0;
    width:50%;
  }
</style>
