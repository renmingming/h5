<template>
	<div class="mask-wrapper" v-show="mask">
		<div class="mask-content">
			<div class="tips" v-if="tips_1">本区限投一组数，可以加注！</div>
			<div class="tips" v-if="tips_2">正在开奖，无法下注！</div>
			<div class="tips" v-if="tips_3">您还没有下注！</div>
			<div class="mask-button" @click="close()">确定</div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'Mask',
		computed:{
			mask(){
				return this.$store.state.mask; 
			},
			tips_1(){
				return this.$store.state.tips_1;
			},
			tips_2(){
				return this.$store.state.tips_2;
			},
			tips_3(){
				return this.$store.state.tips_3;
			}
		},
		methods:{
			close(){
				this.$store.state.mask = false; 	
				this.$store.state.tips_1 = false;
				this.$store.state.tips_2 = false;
				this.$store.state.tips_3 = false;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mask-wrapper{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.8);
	}
	.mask-content{
		position: relative;
	    left: 0;
	    right: 0;
	    top: 35%;
	    margin: auto;
	    width: 80%;
	    height: 2rem;
	    border: 1px solid white;
	    background: white;
	    text-align: center;
	    border-radius: 5px;
	}
	.mask-button{
		position: absolute;
	    width: 90%;
	    height: 30px;
	    left: 5%;
	    bottom: 5px;
	    line-height: 30px;
	    text-align: center;
	    background: red;
	    color: white;
	    border-radius: 4px;
	}
	.tips{
		position: relative;
		top: 30%;
	}
</style>