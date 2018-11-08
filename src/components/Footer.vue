<template>
	<div id="footer">
		每注100床点，共{{total}}床点
		<button @click="submit()">下注</button>
	</div>
</template>
<script>
	import jq from "jquery";
	import utils from "../assets/js/utils.js"
	export default{
		name: 'footer',
		data(){
			return{
				
			}
		},
		computed:{
			total(){
				return this.$store.state.betTotal+this.$store.state.sumTotal;
			},
			pool_one_active(){
				return this.$store.state.pool_one_active;
			},
			pool_two_active(){
				return this.$store.state.pool_two_active;
			}
		},
		watch:{
			
		},
		methods:{
			submit(){
				if(this.$store.state.submit){
					let param = this.getParam();
					console.log(param);
					let vm = this;
					jq.ajax({
						url: utils.urlPrefix + 'shicai/bet',
						method: 'post',
						headers: {'ticket': utils.request('ticket')},
						data: param,
						success: function(res){
							console.log(res);
							if(res.code == 1000){
								window.location.reload();
							}else{
								vm.$store.state.mask = true;
								vm.$store.state.tips_2 = true;	
							}
						},
						error: function(err){
							console.log("xxxx");
						}
					});
				}else{
					this.$store.state.mask = true;
					this.$store.state.tips_3 = true;
				}
			},
			getParam(){
				let param = {};
				if(this.pool_one_active && this.pool_two_active){
					param.sc_id = this.$store.state.sc_id;
					param.pool_one = this.$store.state.pool_one;
					param.pool_two = this.$store.state.pool_two;
				}else if(this.pool_one_active && !this.pool_two_active){
					param.sc_id = this.$store.state.sc_id;
					param.pool_one = this.$store.state.pool_one;
				}else if(!this.pool_one_active && this.pool_two_active){
					param.sc_id = this.$store.state.sc_id;
					param.pool_two = this.$store.state.pool_two;
				}
				return param;
			}
		},
	}
</script>
<style lang="scss" scoped>
	#footer{
		overflow: hidden;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 44px;
		padding-left: 10px;
		line-height: 44px;
		background: white;
		border-top: 1px solid #b3b3b3;
		button{
			float: right;
			width: 80px;
			height: 100%;
			background: #eb0000;
			color: white;
			border: none;
			outline: none;
		}
	}	
</style>