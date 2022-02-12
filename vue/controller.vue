<template>
    <div>Controller...{{msg}}</div>
</template>

<script>
  module.exports = {
    data: ()=>{
      return {
        msg: 'world!',
        color: 'blue',
      }
    },
    methods:{
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted controller');
    }
  }
//@ sourceURL=/vue/controller.vue
</script>

<style scoped>
  
</style>
