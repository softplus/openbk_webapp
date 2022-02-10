

var s1 = document.createElement('script');
//s1.setAttribute('src',"https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.28/vue.js");
s1.setAttribute('src',"https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.26/vue.js");
document.head.appendChild(s1);

s1 = document.createElement('script');
s1.setAttribute('src',"https://unpkg.com/http-vue-loader");
document.head.appendChild(s1);

window.onload = ()=>{
    
    var appdiv = document.createElement('div');
    appdiv.setAttribute('id',"app");
    appdiv.id = 'app';
    appdiv.style.height = "100vh";
    document.body.appendChild(appdiv);
    let comp = document.createElement('my-component');
    appdiv.appendChild(comp);
    
    window.components = [
        { name:'controller', path:'/vue/controller.vue' },
        { name:'myComponent', path:'/vue/myComponent.vue' },
    ];

    let numcomponents = 0;
    
    let addComponent = ()=>{
        let component = httpVueLoader(window.components[numcomponents].path);
        component().then( data =>{
            window.components[numcomponents].data = data;
            numcomponents++;
            if (numcomponents < window.components.length){
                addComponent();
            } else {
                new Vue({
                    el: '#app',
                    components: {
                        'my-component': window.components[numcomponents-1].data
                    }
                });
            }
        });
    }
    
    window.getComponent = (name)=>{
        for (let i = 0; i < numcomponents; i++){
            if (window.components[0].name === name){
                return window.components[0].data;
            }
        }
        return undefined;
    }


    addComponent();
};

