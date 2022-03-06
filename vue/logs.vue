<template>
    <div class="fullheight">
      <div ref="logs" style="height:80%; overflow:scroll;" id="logs"><pre>{{logs}}</pre></div>
      <label for="pause">Pause</label><input type="checkbox" id="pause" name="pause" v-model="paused">
      <button @click="clear">Clear</button>
      <br />

      <label :for="item" v-for="(item, index) in logfeaturenames" :key="item">{{item}}
        <input type="checkbox" id="pause" name="pause" v-model="logfeatures[index]" @click="setfeature(index, this.checked)">
      </label>
      <br />

      <form @submit="send($event)">
        <input v-model="cmd" id="obkcommand" type="text" autocomplete="on" style="width:60%;">
        <input type="submit">
      </form>
    </div>
</template>

<script>
  module.exports = {
    data: ()=>{
      return {
        logs: '',
        cmd: '',
        paused:false,
        logfeaturenames:[
            "HTTP:",//            = 0,
            "MQTT:",//            = 1,
            "CFG:",//             = 2,
            "HTTP_CLIENT:",//     = 3,
            "OTA:",//             = 4,
            "PINS:",//            = 5,
            "MAIN:",//            = 6,
            "GEN:", //              = 7
            "API:", // = 8
            "LFS:", // = 9
            "CMD:", // = 10
        ],
        logfeatures:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
      }
    },
    methods:{
        setfeature(index, enable){
            let url = window.device+'/api/cmnd';
            let cmnd = 'logfeature '+index+' '+(enable?'1':'0');
            fetch(url, {body:cmnd, method:'POST'})
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch((e)=>{
                console.error(e);
            })
        },

        send(ev){
            ev.preventDefault();
            let url = window.device+'/api/cmnd';
            fetch(url, {body:this.cmd, method:'POST'})
            .then(response => response.text())
            .then(data => {
                this.cmd = '';
                console.log(data);
            })
            .catch((e)=>{
                this.cmd = '';
                console.error(e);
            })
        },

        clear(){
            this.logs = '';
        },

        showlogs(){
            let url = window.device+'/lograw';
            if (!this.paused){
                fetch(url)
                .then(response => response.text())
                .then(data => {
                    data.replace(/\r/g, '');
                    this.logs += data;
                    let splt = this.logs.split('\n');
                    // remove empty
                    for (let i = splt.length-1; i >= 0; i--) {
                        if (!splt[i]){
                            splt.splice(i, 1);
                        }
                    }

                    while (splt.length > 400){
                        splt.shift();
                    }

                    if (this.$refs['logs']){
                        let scrollTop = this.$refs['logs'].scrollTop;
                        let scrollHeight = this.$refs['logs'].scrollHeight;
                        let clientHeight = this.$refs['logs'].clientHeight;
                        if (scrollTop + clientHeight >= scrollHeight - 10){
                            setTimeout(()=>{this.$refs['logs'].scrollTop = scrollHeight + 1000});
                        }
                    }
                    this.logs = splt.join('\n');
                    this.logtimer = setTimeout(()=>{this.showlogs();}, 500);
                }).catch(()=>{
                    this.logtimer = setTimeout(()=>{this.showlogs();}, 500);
                });
            } else {
                this.logtimer = setTimeout(()=>{this.showlogs();}, 500);
            }
        },
    },
    mounted (){
        console.log('mounted');
        this.showlogs();
    },

    destroyed (){
        if (this.logtimer){
            clearTimeout(this.logtimer);
            this.logtimer = null;
        }
    }


  }
//@ sourceURL=/vue/logs.vue
</script>

<style scoped>
.fullheight {
    height:95%;
}
  
</style>
