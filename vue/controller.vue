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
        this.showlogs();
    }
  }
//@ sourceURL=/vue/controller.vue
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
