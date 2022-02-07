<template>
  <span class="example">Hello {{ msg }}</span>
</template>
<script>
  export default {
    data () {
      return {
        msg: 'world!',
        color: 'blue',
      }
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted');
    }
  }
</script>

<style scoped>
  .example {
    color: v-bind('color');
  }
</style>
