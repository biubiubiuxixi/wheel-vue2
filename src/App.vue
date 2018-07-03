<template>
    <div id="app">
        <h1>{{ msg }}</h1>
        <img src="./img/pig.jpg" />
        <input type="text" v-model="msg" />
    </div>
</template>

<script>
import getdata from './util.js';

export default {
    name: 'app',
    data() {
        return {
            msg: '你好请你输入',
        }
    },
    created() {
        this.fetchData();
        console.log('23333');
    },
    methods: {
        async fetchData() {
            const data = await getdata();
            this.msg = data;
        }
    }
}
</script>

<style lang="scss">
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        h1 {
            color: green;
        }
    }
</style>

