<template>
    <div class="fullscreen">
    <!-- Tab links -->
    <div class="tab">
      <button :class="'tablinks '+Logsclass" @click="open($event, 'Logs')">Logs</button>
      <button :class="'tablinks '+Configclass" @click="open($event, 'Config')">Config</button>
      <button :class="'tablinks '+Statusclass" @click="open($event, 'Status')">Status</button>
      <button :class="'tablinks '+OTAclass" @click="open($event, 'OTA')">OTA</button>
      <button :class="'tablinks '+Aboutclass" @click="open($event, 'About')">About</button>
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
        <div id="a" class="radiused" style="backgroundstyle">
           <input id="sl1" type="range" min="153" max="500" value="0" @change="change('t',0,value)" name="sl1">
        </div>
        <div id="b" class="radiused" style="background-image:linear-gradient(to right,#800,#f00 5%,#ff0 20%,#0f0 35%,#0ff 50%,#00f 65%,#f0f 80%,#f00 95%,#800);">
            <input id="sl2" type="range" min="1" max="359" value="0" @change="change('h',0,value)" name="sl2">
        </div>
        <div id="s" class="radiused" v-bind:style="backgroundstyle">
            <input id="sl3" type="range" min="0" max="100" value="0" @change="change('n',0,value)" name="sl3">
        </div>
        <div id="c" class="radiused" style="background-image:linear-gradient(to right,#000,#fff);">
            <input id="sl4" type="range" min="0" max="100" value="100" @change="change('d',0,value)" name="sl4">
        </div>
    </div>    

    <div class="tabcontent" v-if="tab === 'About'">
      <h3>About</h3>
      <p>A simple web app to go with OpenBekenIOT equipped devices by <a href="https://github.com/btsimonh">btsimonh</a></p>
      <p>This app is a pure javascript application written in VueJS as an SFC .vue component, and dynamically loaded from the device via a simple webpage.  The intent here is to be able to provide a rich UI and allow the device UI to remain simple (and small).</p>
      <p>Currently, it supports displaying logging from the device</p>
      <test-controller></test-controller>
    </div>    

    <div class="tabcontent" v-if="tab === 'OTA'">
      <h3>OTA</h3>
      <ota-controller></ota-controller>
    </div>    

    </div>
</template>

<script>
  module.exports = {
  components: {
    'ota-controller': window.getComponent('ota'),
    'test-controller': window.getComponent('controller'),
  },
      
    data: ()=>{
      return {
        msg: 'world!',
        color: 'blue',
        logs: '',
        tab: 'Config',
        backgroundstyle:{
            backgroundImage:"linear-gradient(to right,#eff,#f81)"
        },
        Logsclass:'',
        Aboutclass:'',
        Configclass:'active',
        Statusclass:'',
        OTAclass: '',
      }
    },
    methods:{
        open(evt, name) {
            console.log('select tab '+name);
            this.tab = name;
            this.Logsclass = '';
            this.Aboutclass = '';
            this.Configclass = '';
            this.Statusclass = '';
            this.OTAclass = '';

            this[name+'class'] = 'active';
        },       
        

        change(v,i,p){
          if(document.getElementById('s')){
            if(v=='h'||v=='d'){
              var sl=document.getElementById('sl4').value;
              this.backgroundstyle.backgroundImage= 
                'linear-gradient(to right,rgb('+sl+'%,'+sl+'%,'+sl+'%),hsl('+document.getElementById('sl2').value+',100%,50%))'
            }
          }
          console.log(v+i+'='+p);
          //la('&'+v+i+'='+p);
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
//@ sourceURL=/vue/myComponent.vue
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
    .radiused {
        border-radius:0.3em;
        padding:2px;
        margin:6px 2px;
    }
    input[type=range] {
        width:99%;
    }

  
</style>
