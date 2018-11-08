<template>
  <div id="app">
    <Game></Game>
    <sec-content></sec-content>
    <sec-footer></sec-footer>
    <sec-mask></sec-mask>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import router from './router'
import utils from "./assets/js/utils.js"
import Game from "./components/Game.vue"
import Footer from "./components/Footer.vue"
import Content from "./components/Content.vue"
import Mask from "./components/Mask.vue"
export default {
  name: 'app',
  components:{
    Game,
    'sec-footer': Footer,
    'sec-mask': Mask,
    'sec-content': Content,
  },
  mounted(){
    this.$store.state.ticket=utils.request('ticket');
    console.log('ticket:'+utils.request('ticket'));
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  padding-bottom: 44px;
}
</style>
