<template>
    <div>
        <div>
          <!--<span v-for="item in channels" v-bind:key="item">{{item}}:{{channels[item]}} </span>-->
          <div v-for="(item, key) in channels" v-bind:key="item">
            <div >
              <button 
                v-if="(channelrolenames[+key] === 'Rel') || (channelrolenames[+key] === 'Rel_n') || (channelrolenames[+key] === 'PWM')"
                v-bind:key="'button'+item" 
                :class="item?'set':'unset'" 
                @click="channelclick(key)"
              >{{channels[key]?'Off':'On'}}</button>
              <span v-bind:key="'span'+item">{{key}}:{{item}} role {{channelrolenames[+key]}}</span>
              <input 
                v-if="channelrolenames[+key] === 'PWM'" 
                v-bind:key="'input'+item" 
                type="range" 
                min="0" 
                max="255" 
                v-model="channels[key]" 
                @input="channelchange(key)">
            </div>
          </div>
        </div>

<!--
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
-->        
    </div>
</template>

<script>
  module.exports = {
    data: ()=>{
      return {
        pins:{ rolenames:[], roles:[], channels:[] },
        channels:{},
        channelroles:[],
        channelrolenames:[],

        error:'',
        interval: null,
      }
    },
    methods:{
      getPins(cb){
        let url = window.device+'/api/pins';
        fetch(url)
            .then(response => response.json())
            .then(res => {
              this.pins = res;
              if (cb) cb();
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!
      },

      getChannels(){
        let url = window.device+'/api/channels';
        fetch(url)
            .then(response => response.json())
            .then(res => {
              this.channels = res;
              console.log(this.channels);
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!
      },

      setChannels(){
        let url = window.device+'/api/channels';
        let data = [];

        let chanmax = 0;
        for (let i = 0; i < 32; i++){
          if (undefined !== this.channels[i]){
            if (chanmax < i+1){
              chanmax = i+1;
            }
          }
        }


        for (let i = 0; i < chanmax; i++){
          if (undefined !== this.channels[i]){
            data.push(+this.channels[i]);
          } else {
            data.push(0);
          }
        }

        fetch(url, { 
                      method: 'POST',
                      body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(res => {
              this.getChannels();
            })
            .catch(err => {
              this.error = err.toString();
              console.error(err)
            }); // Never forget the final catch!

      },

      channelchange(channel){
        console.log(this.channels);
        console.log('change chan '+JSON.stringify(channel)+' to '+this.channels[channel]);
        this.setChannels();
      },

      channelclick(channel){
        if (this.channels[channel]) {
          this.channels[channel] = 0;
        } else {
          this.channels[channel] = 255;
        }
        this.channelchange(channel);
      },

      setupView(){
        this.getPins(()=>{
          this.getRolesForChannels();
          this.getChannels();
        })
      },
      
      getRolesForChannels(){
        let role = 0;
        if (this.pins.roles){
          for (let i = 0; i < this.pins.roles.length; i++){
            if (this.pins.roles[i]){
              let ch = this.pins.channels[i];
              let role = this.channelroles[ch] = this.pins.roles[i];
              this.channelrolenames[ch] = this.pins.rolenames[role];
            } 
          }
        }
      },
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted controller');
        this.setupView();
    },
    destroyed(){
      clearInterval(this.interval);
    }

  }
//@ sourceURL=/vue/control.vue
</script>

<style scoped>
  .set {
    background-color: green;
  }  
  .unset {
    background-color: white;
  }  
</style>
