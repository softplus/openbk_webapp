

var s1 = document.createElement('script');
s1.setAttribute('src',"https://unpkg.com/vue@next");
document.head.appendChild(s1);

s1 = document.createElement('script');
s1.setAttribute('src',"https://cdn.jsdelivr.net/npm/vue3-sfc-loader");
document.head.appendChild(s1);

window.onload = ()=>{
    
    var appdiv = document.createElement('div');
    appdiv.setAttribute('id',"app");
    document.body.appendChild(appdiv);
    
    
    const options = {
      moduleCache: {
        vue: Vue,
      },
      getFile(url) {
        return fetch(url).then(response => response.ok ? response.text() : Promise.reject(response));
      },
      addStyle(styleStr) {
        const style = document.createElement('style');
        style.textContent = styleStr;
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
      },
      
      log(type, ...args) {
        console.log(type, ...args);
      }
    }
    
    const { loadModule, version } = window["vue3-sfc-loader"];
    
    console.log("root is "+root);
    
    const app = Vue.createApp({
      components: {
        'my-component': Vue.defineAsyncComponent(() => loadModule(root+'vue/myComponent.vue', options)),
      },
      template: `Hello <my-component></my-component> <sub>from vue3-sfc-loader v${ version }</sub>`
    });
    
    app.mount('#app');
};

