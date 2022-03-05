<template>
    <div class="fullheight">
      <div ref="logs" style="height:80%; overflow:scroll;" id="logs"><pre>{{logs}}</pre></div>
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
      }
    },
    methods:{
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

        showlogs(){
            let url = window.device+'/lograw';
            fetch(url)
            .then(response => response.text())
            .then(data => {
                console.log(data);
                this.logs += data;
                let splt = this.logs.split('\n');
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
