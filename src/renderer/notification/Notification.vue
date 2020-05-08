<template>
    <div>
      <h1></h1>
      ddhodhdofdhosdhfosd
    </div>
</template>
<!--<script src="https://cdn.jsdelivr.net/npm/vue"></script>-->
<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'app',
  data(){
    return{
       title: "Hello World"
    }
  },
  created(){
  /*    ipcRenderer.on("response-message", (event, args) => {
        console.log(args);
        this.responseMessage = args;
      });*/
  }
}
</script>