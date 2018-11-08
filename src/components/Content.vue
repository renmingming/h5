<template>
	<div class="content-wrapper">
		<!-- <router-view></router-view> -->
		<Lottery v-if="!isLotterty"></Lottery>
		<Bet v-else></Bet>
	</div>
</template>
<script>
	import Lottery from '../components/RecordLottery.vue'
	import Bet from "../components/RecordBet.vue"
	export default{
		name: 'Content',
		data(){
			return {
				
			}
		},
		computed:{
			isLotterty(){
				return this.$store.state.isLotterty;
			}
		},
		components:{
			Lottery,
			Bet,
		}
	}
</script>
<style lang="scss" scoped>
	.content-tab{
		display: flex;
		justify-content: space-around;
		width: 100%;
		height: 1.17rem;
		background: url("../assets/image/tab.png") no-repeat;
		background-size: 100% 200%;
		background-position-y: 0;
		.link-item{
			width: 42%;
		}
	}
	.active{
		background-position-y: 100%;
	}
</style>