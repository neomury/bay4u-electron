//import Vue from 'vue'
//import App from './Notification'
//import { ipcRenderer } from 'electron'

import Vue from 'vue'
new Vue({
    el: '#app',
    data: {
        message: 'hello'
    },
    created() {
        console.log('hello created!!');
        this.message = this.message + 'hello32';
    },
    mounted() {
        console.log('mounted!!');
        // this.message = 'hello3';
    }
})