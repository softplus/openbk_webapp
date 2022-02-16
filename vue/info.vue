<template>
    <div>
      <p>UpTime: {{uptime_s}}s</p>
      <p>Build: {{build}}</p>
      <p>IP Address: {{ip}}</p>
      <p>MAC Address: {{mac}}</p>
      <p>MQTT Server: {{mqtthost}}</p>
      <p>MQTT Topic: {{mqtttopic}}</p>
      <p v-if="error">Error: {{error}}</p>
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
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!

      }
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted controller');
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
