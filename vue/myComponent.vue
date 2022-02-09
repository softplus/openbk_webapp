<template>
    <div class="fullscreen">
    <!-- Tab links -->
    <div class="tab">
      <button class="tablinks" @click="open($event, 'Logs')">Logs</button>
      <button class="tablinks" @click="open($event, 'Config')">Config</button>
      <button class="tablinks" @click="open($event, 'Status')">Status</button>
      <button class="tablinks" @click="open($event, 'About')">About</button>
    </div>
    
    <!-- Tab content -->
    <div class="tabcontent" v-if="tab === 'Logs'">
      <div style="height:80%; overflow:scroll;" id="logs"><pre>{{logs}}</pre></div>
    </div>
    
    <div class="tabcontent" v-if="tab === 'Config'">
      <h3>Config</h3>
      <p>Config page.</p>
    </div>
    
    <div class="tabcontent" v-if="tab === 'Status'">
      <h3>Status</h3>
      <p>Status Page.</p>
    </div>    
    <div class="tabcontent" v-if="tab === 'About'">
      <h3>About</h3>
      <p>A simple web app to go with OpenBekenIOT equipped devices.</p>
      <p>This app is a pure javascript application written in VueJS as an SFC .vue component, and dynamically loaded from the device via a simple webpage.  The intent here is to be able to provide a rich UI and allow the device UI to remain simple (and small).</p>
      <p>Currently, it support displaying logging from the device</p>
    </div>    
    </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'world!',
        color: 'blue',
        logs: '',
        tab: 'Config',
      }
    },
    methods:{
        open(evt, name) {
            console.log('select tab '+name);
            this.tab = name;
        },       
        
        showlogs(){
            if (this.tab === 'Logs'){
              let url = window.device+'/lograw';
              fetch(url)
                .then(response => response.text())
                .then(data => {
                    this.logs += data;
                    let splt = this.logs.split('\n');
                    while (splt.length > 400){
                        splt.shift();
                    }
                    this.logs = splt.join('\n');
                    setTimeout(()=>{this.showlogs();}, 1000);
                });
            } else {
                setTimeout(()=>{this.showlogs();}, 1000);
            }
        },
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted');
        this.showlogs();
    }
  }
</script>

<style scoped>
    .fullscreen{
        height:100%;
    }

    .example {
        color: v-bind('color');
    }

    /* Style the tab */
    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }
    
    /* Style the buttons that are used to open the tab content */
    .tab button {
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 14px 16px;
      transition: 0.3s;
    }
    
    /* Change background color of buttons on hover */
    .tab button:hover {
      background-color: #ddd;
    }
    
    /* Create an active/current tablink class */
    .tab button.active {
      background-color: #ccc;
    }
    
    /* Style the tab content */
    .tabcontent {
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-top: none;
      height:90%;
    }
</style>
