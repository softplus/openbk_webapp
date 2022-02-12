<template>
    <div>
        <div>
        <button @click="backup(null, $event)">Read fsblock</button>
        <button @click="restore(null, $event)">Restore fsblock</button>
        </div>
        <input type="text" v-model="folder">
        <div class="drop" @drop="dropHandler($event)" @dragover="dragOverHandler($event)">
            <div class="otatext center" v-html="otatext"></div>
        </div>
        <div v-html="status"></div>
        <div v-html="output"></div>
    </div>
</template>

<script>
  module.exports = {

    data: ()=>{
      return {
        msg: 'world!',
        backupdata: null,
        status:'nothing going on',
        folder:'',
        otatext:'drop file(s) here',

        output: '',
      }
    },
    methods:{
        dropHandler(ev){
            ev.preventDefault();
            console.log('drop');
            if (ev.dataTransfer.items) {
                this.getFilesDataTransferItems(ev.dataTransfer.items)
                .then(files => {
                    console.log(files);
                    let allfiles = [];
                    let addfolder = (f)=>{
                        for (let i = 0; i < f.length; i++){
                            if (f[i].subfolder){
                                addfolder(f[i].subfolder);
                            } else {
                                allfiles.push(f[i]);
                            }
                        }
                    };

                    addfolder(files);

                    console.log(allfiles);

                    this.uploadfiles(allfiles);

                });
                return;
            }
        },



        uploadfiles(files, cb) {
            let filecount = 0;

            let saveone = ()=>{
                if (filecount < files.length){
                    reader = new FileReader();
                    reader.onload = (event) => {
                        console.log(event);
                        console.log('file len:'+event.target.result.byteLength);
                        this.status += '<br/>save '+files[filecount].filepath;
                        this.savefile(files[filecount].filepath, event.target.result, ()=>{
                            filecount++;
                            this.status += '.. done';
                            saveone();
                        });
                        //holder.style.background = 'url(' + event.target.result + ') no-repeat center';
                    };
                    reader.readAsArrayBuffer(files[filecount]);
                } else {
                    if (cb) cb();
                }
            }

            saveone();
        },

        getFilesDataTransferItems(dataTransferItems) {
            function traverseFileTreePromise(item, path = "", folder) {
                return new Promise(resolve => {
                    if (item.isFile) {
                        item.file(file => {
                            file.filepath = (path || "") + file.name; //save full path
                            folder.push(file);
                            resolve(file);
                        });
                    } else if (item.isDirectory) {
                        let dirReader = item.createReader();
                        dirReader.readEntries(entries => {
                        let entriesPromises = [];
                        subfolder = [];
                        folder.push({ name: item.name, subfolder: subfolder });
                        for (let entr of entries)
                            entriesPromises.push(
                            traverseFileTreePromise(entr, (path || "")  + item.name + "/", subfolder)
                            );
                        resolve(Promise.all(entriesPromises));
                        });
                    }
                });
            }

            let files = [];
            return new Promise((resolve, reject) => {
                let entriesPromises = [];
                for (let it of dataTransferItems)
                entriesPromises.push(
                    traverseFileTreePromise(it.webkitGetAsEntry(), null, files)
                );
                Promise.all(entriesPromises).then(entries => {
                resolve(files);
                });
            });
        },



        dragOverHandler(ev){
            //console.log('File(s) in drop zone');
            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();
        },

        savefile(name, data, cb){
            this.status += '<br/>saving file...';
            let url = window.device+'/api/lfs/';
            if (this.folder){
                url += this.folder;
                url += '/'
            }
            url += name;
            fetch(url, { 
                    method: 'POST',
                    body: data
                })
                .then(response => response.text())
                .then(text => {
                    console.log('received '+text);
                    this.status += 'save complete...';
                    if(cb) cb();
                })
                .catch(err => console.error(err)); // Never forget the final catch!
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
