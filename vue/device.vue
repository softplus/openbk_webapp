<template>
  <div v-if="selectedDevice">
    <div>
      Chipset: {{ selectedDevice.chip}} {{ selectedDevice.board }}<br/>
      Model: {{ selectedDevice.model || "unknown"}}<br/>
      <img v-bind:src="selectedDevice.image" height="200" v-bind:alt="getDeviceDisplayName(selectedDevice)"/>
    </div>

    <ul>
      <li v-for="(pin,key) in selectedDevice.pins" :key="key">
        <span v-if="pin.split(';').length === 2">
          Pin {{key}}: {{ pin.split(';')[0] }} on channel {{ pin.split(';')[1] }} {{ pin.split(';')[2] }}
        </span>
        <span v-else>
          Pin {{key}}: {{ pin.split(';')[0] }} on channels {{ pin.split(';')[1] }}, {{ pin.split(';')[2] }}
        </span>
      </li>
    </ul>

    <a v-bind:href="selectedDevice.wiki" target="_blank">Wiki</a>
    <div v-if="selectedDevice.urls">
      Links: 
      <span v-for="(url,index) in selectedDevice.urls" :key="url">
        <span v-if="index > 0">, </span><a v-bind:href="url" target="_blank">{{index+1}}</a>
      </span>
      <br/>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: {
      selectedDevice: Object
    },
    methods:{
      getDeviceDisplayName(dev){
        //The first option is placeholder with no name
        return dev.name ? dev.vendor + " " + dev.name : "";
      }
    }
}
//@ sourceURL=/vue/device.vue
</script>