<template>
    <div>
      <p>UpTime: {{uptime_s}}s</p>
      <p>Build: {{build}}</p>
      <p>IP Address: {{ip}}</p>
      <p>MAC Address: {{mac}}</p>
      <p>MQTT Server: {{mqtthost}}</p>
      <p>MQTT Topic: {{mqtttopic}}</p>
      <p>WEBAPP Url root: {{webapp}}</p>
      <p v-if="error">Error: {{error}}</p>
      <p>Pin Settings:</p>
      <div v-for="(role, index) in pins.roles" :key="index">
        <span>{{index}}</span>
        <select v-model="pins.roles[index]">
          <option v-for="(name, index2) in pins.rolenames" :value="index2" :key="index2" :selected="(role == index2)">{{name}}</option>
        </select>
        <input type="number" min="0" max="32" step="1" v-model="pins.channels[index]">
      </div>
      <button @click="savePins">Save Pins</button>
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

        pins:{ rolenames:[], roles:[], channels:[] },

        error:'',
        interval: null,
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
      }
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted controller');
        this.getPins();
        this.getinfo();
        this.interval = setInterval(()=>{
          this.getinfo();
        }, 10000);
    },
    destroyed(){
      clearInterval(this.interval);
    }

  }
//@ sourceURL=/vue/controller.vue
</script>

<style scoped>
  
</style>
