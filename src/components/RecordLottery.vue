<template>
	<div class="wrapper">
		<div class="content-tab">
			<!-- <router-link :to="{name:'bet',query:{ticket:tokent}}" class="link-item record-bet"></router-link> -->
			<div class="link-item record-bet"  @click="tab()"></div>
		</div>
		<div class="record-wrapper" @scroll="loadMore()">
			<div class="record-item" v-for="item in record">
				<div class="item-periods">
					{{item.sc_id}}期
				</div>
				<div class="item-content" v-if="item.desc">
					<span class="loading">{{item.desc}}</span>
				</div>
				<div class="item-content" v-else>
					<div class="type type-1">
						<div class="img-wrapper">
							<img :src="'../../static/image/'+item.first_num+'.png'" />
							<img :src="'../../static/image/'+item.second_num+'.png'" />
							<div class="tips tips-1">一等奖单注：{{item.first_prize}}</div>
							<div class="tips tips-2">二等奖单注：{{item.second_prize}}</div>
						</div>					
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import jq from "jquery";
	export default{
		name: 'RecordLottery',
		data(){
			return{
				record: [],
				startId: 0,
			}
		},
		mounted(){
			this.$axios.get('shicai/record',{
				params:{
					type: 0
				}
			}).then(res => {
				console.log(res.data);
				let obj = res.data;
				this.record = obj.data.record;
				this.startId = obj.data.startId;
			}).catch(err => {
				console.log(err);
			});
		},
		computed:{
			tokent(){
				return this.$store.state.ticket;
			},
		},
		methods:{
			loadMore(){
				let vm = this;
				let $this = jq(".record-wrapper")[0];
				let clientHeight = $this.clientHeight;
				let scrollHeight = $this.scrollHeight;
				let scrollTop = jq(".record-wrapper").scrollTop();
				if(scrollTop + clientHeight >= scrollHeight){
					this.$axios.get('shicai/record',{
					params:{
						type: 0,
						start_id: vm.startId 
					}
				}).then(res => {
					let obj = res.data;
					obj.data.record.forEach(function(item){
						vm.record.push(item);
					});
					vm.startId = obj.data.startId;
					console.log("startId:"+ vm.startId);
					console.log(res.data);
				}).catch(err => {
					console.log(err);
				});
				}
			},
			tab(){
				this.$store.state.isLotterty = !this.$store.state.isLotterty
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content-tab{
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 1.17rem;
		background: url("../assets/image/tab.png") no-repeat;
		background-size: 100% 200%;
		background-position-y: 0;
		.link-item{
			float: right;
			width: 50%;
			height: 100%;
		}
	}
	.record-wrapper{
		overflow-y: scroll;
		height: 11rem;
		padding: 0.2rem;
		background-color: #197648;
	}
	.record-item{
		display: flex;
		justify-content: space-between;
		padding: 0.3rem 0.2rem;
		padding-right: 0.4rem;
		margin-bottom: 0.2rem;
		border-radius: 0.2rem;
		background: #35A56E;
	}
	.item-periods{
		display: flex;
	    justify-content: center;
	    align-items: center;
		width: 2rem;
		color: white;
		text-align: center;
		border-right: 1px solid #12632C;
		span{
			position: relative;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.item-content{
		width: 4rem;
		text-align: left;
		color: white;
		.loading{
			color: #12632C;
		}
	}
	.type{
		display: flex;
		justify-content: space-between;
		width: 4rem;
	}
	.type-2{
		margin-top: 6px;
		padding-top: 0.2rem;
		border-top: 1px solid #12632C;
	}
	.img-wrapper{
		overflow: hidden;
		position: relative;
		width: 2rem;
		height: calc(0.9rem + 16px);
		padding-left: 5px;
		img{
			float: left;
			width: 0.5rem;
			height: 0.5rem;
			margin-right: 0.18rem;
		}
		.tips{
			position: absolute;
			font-size: 12px;
			color: white;
		}
		.tips-1{
			bottom: 16px;
		}
		.tips-2{
			bottom: 0;
		}
	}
	.status{
		line-height: 0.5rem;
		font-weight: bold;
		padding-right: 5px;
		color: #15623B;
	}
	.status-false{
		color: #15623B;
	}
	.status-true{
		color: #E80F1F;
	}
</style>