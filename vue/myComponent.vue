<template>
    <div style="height:80%; overflow:scroll;" id="logs"><pre>{{logs}}</pre></div>
  <span class="example">Hello {{ msg }}</span>
</template>
<script>
  export default {
    data () {
      return {
        msg: 'world!',
        color: 'blue',
        logs: '',
      }
    },
    methods:{
        showlogs(){
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
  .example {
    color: v-bind('color');
  }
</style>
