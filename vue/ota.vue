<template>
    <div>
        <div>
        <button @click="backup(null, $event)">Read fsblock</button>
        <button @click="startota(null, $event)">Start OTA</button>
        <button @click="reboot(null, $event)">Reboot</button>
        <button @click="restore(null, $event)">Restore fsblock</button>
        <br/>
        <button @click="sequence(null, $event)">Backup/OTA/Resore</button>
        <br/>
        <select v-model="defaultaction">
            <option value=''>Do nothing</option>
            <option value='ota'>OTA Only</option>
            <option value='sequence'>Backup/OTA/Restore</option>
        </select>
        <span>Selected: {{ defaultaction }}</span>
        </div>
        <div class="drop" @drop="dropHandler($event)" @dragover="dragOverHandler($event)">
            <div class="otatext center" v-html="otatext"></div>
        </div>
        <div v-html="status"></div>
    </div>
</template>

<script>
  module.exports = {

    data: ()=>{
      return {
        msg: 'world!',
        backupdata: null,
        otadata:null,
        otatext:'drop OTA file (.RBL) here',
        status:'nothing going on',
        defaultaction: ''
      }
    },
    methods:{
        dropHandler(ev){
            ev.preventDefault();
            console.log('drop');
            if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (ev.dataTransfer.items[i].kind === 'file') {
                        var file = ev.dataTransfer.items[i].getAsFile();
                        console.log('... file[' + i + '].name = ' + file.name);
                        reader = new FileReader();
                        reader.onload = (event) => {
                            console.log(event);
                            console.log('set otadata len:'+event.target.result.byteLength);
                            this.otadata = event.target.result;
                            this.otatext = file.name + ' len:'+this.otadata.byteLength;
                            this.status = 'OTA file dropped...';
                            switch (this.defaultaction){
                                case 'ota': this.startota(); break;
                                case 'sequence':  this.sequence(); break;
                            }
                            //holder.style.background = 'url(' + event.target.result + ') no-repeat center';
                        };
                        console.log(file);
                        reader.readAsArrayBuffer(file);
                    }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                    console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
                    reader = new FileReader();
                    reader.onload = (event) => {
                        console.log(event);
                        console.log('set otadata len:'+event.target.result.byteLength);
                        this.otadata = event.target.result;
                        this.otatext = file.name + ' len:'+this.otadata.byteLength;
                        this.status = 'OTA file dropped...';
                    };
                    console.log(file);
                    reader.readAsArrayBuffer(file);
                }
            }            
        },

        dragOverHandler(ev){
            //console.log('File(s) in drop zone');
            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();
        },

        sequence(){
            if (this.otadata){
                this.backup(()=>{
                    this.startota(()=>{
                        this.status += '<br/>waiting for reboot...';
                        let count = 40;
                        let checkrestore = ()=>{
                            count--;
                            if (!count){
                                this.restore(()=>{
                                    this.status += '<br/>Sequence complete';
                                });
                            } else {
                                this.status += '.'+count;
                                setTimeout(checkrestore, 1000);
                            }
                        };
                        checkrestore();
                    })
                })
            } else {
                this.status = 'Drop an OTA file first...';
            }
        },

        reboot(cb){
            let url = window.device+'/api/reboot';
            fetch(url, {
                method: 'POST',
                body: ''
            })
                .then(response => response.text())
                .then(text => {
                    if(cb) cb();
                });
        },

        backup(cb){
            this.status += '<br/>starting backup...';
            let url = window.device+'/api/fsblock';
            fetch(url)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                    this.backupdata = buffer; 
                    console.log('received '+buffer.byteLength);
                    this.status += '..backup done...';
                    if(cb) cb();
                })
                .catch(err => console.error(err)); // Never forget the final catch!
        },

        startota(cb){
            this.status += '<br/>starting OTA...';
            console.log('start ota ');
            let url = window.device+'/api/ota';
            if (this.otadata){
                fetch(url, { 
                        method: 'POST',
                        body: this.otadata
                    })
                    .then(response => response.text())
                    .then(text => {
                        console.log('received '+text);
                        this.otatext += ' finished:'+text;
                        this.status += '<br/>rebooting...';
                        this.reboot(cb);
                    })
                    .catch(err => console.error(err)); // Never forget the final catch!
            }
        },
        restore(cb){
            this.status += '<br/>starting restore...';
            let url = window.device+'/api/fsblock';
            if (this.backupdata){
                fetch(url, { 
                        method: 'POST',
                        body: this.backupdata
                    })
                    .then(response => response.text())
                    .then(text => {
                        console.log('received '+text);
                        this.status += 'Restore complete...';
                        if(cb) cb();
                    })
                    .catch(err => console.error(err)); // Never forget the final catch!
            }
        },
    },
    mounted (){
        this.msg = 'fred';
        console.log('mounted ota');
    }
  }
//@ sourceURL=/vue/controller.vue
</script>

<style scoped>
    .drop {
        border: 5px solid blue;
        width:  200px;
        height: 100px;
        text-align: center;
        position: relative;
        vertical-align: center;
    }

    .otatext {
    }
    .center {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
