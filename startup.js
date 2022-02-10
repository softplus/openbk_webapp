

var s1 = document.createElement('script');
s1.setAttribute('src',"https://cdn.jsdelivr.net/npm/vue@2.x");

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
        { name:'controller', path:root+'vue/controller.vue' },
        { name:'myComponent', path:root+'vue/myComponent.vue' },
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
            if (window.components[i].name === name){
                return window.components[i].data;
            }
        }
        return undefined;
    }


    addComponent();
};

