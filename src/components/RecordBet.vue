<template>
	<div class="wrapper">
		<div class="content-tab" @click="tab()">
			<!-- <router-link :to="{name:'lottery',query:{ticket:tokent}}" class="link-item record-bet"></router-link> -->
			<div class="link-item record-bet"></div>
		</div>
		<div class="record-wrapper" @scroll="loadMore()">
			<div class="record-item" v-for="item in record">
				<div class="item-periods">
					{{item.sc_id}}期
				</div>
				<div class="item-content">
					<div class="type type-1" v-if="item.first_num">
						<div class="img-wrapper">
							<img :src="'../../static/image/'+item.first_num+'.png'" />
							<img :src="'../../static/image/'+item.second_num+'.png'" />
							<div class="point">投注{{item.s_first_bet || item.bed_point}}床点</div>
						</div>					
						<div v-if="item.s_first_desc" :class="[{'status-true':(item.s_first_desc!='未中奖')},'status']">{{item.s_first_desc}}</div>
						<div v-else :class="[{'status-true':(item.desc!='未中奖')},'status']">{{item.desc}}</div>
					</div>
					<div class="type type-2" v-if="item.s_first_num">
						<div class="img-wrapper">
							<img v-if="item.second_num" :src="'../../static/image/num-'+(item.first_num+item.second_num)+'.png'" />
							<img v-else :src="'../../static/image/num-'+item.s_first_num+'.png'" />
							<div class="point">投注{{item.s_second_bet || item.bed_point}}床点</div>
						</div>					
						<div v-if="item.s_second_desc" :class="[{'status-true':(item.s_second_desc!='未中奖')},'status']">{{item.s_second_desc}}</div>
						<div v-else :class="[{'status-true':(item.desc!='未中奖')},'status']">{{item.desc}}</div>
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
				historyId: [],
				firstLoad: true,
			}
		},
		mounted(){
			this.$axios.get('shicai/record',{
				params:{
					type: 1,
					limit: 5 
				}
			}).then(res => {
				console.log(res.data);
				let obj = res.data;
				this.record = obj.data.record;
				this.startId = obj.data.startId;
				console.log(this.historyId);
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
				if(scrollTop + clientHeight >= scrollHeight && vm.startId){
					console.log("startId:"+vm.startId);
					if(vm.firstLoad){
						console.log("初次加载更多");
						vm.historyId.push(vm.startId);
						vm.getData(vm.startId)
						console.log(vm.historyId);
					}else if(vm.historyId.indexOf(vm.startId)<0){
						console.log("加载更多");
						vm.historyId.push(vm.startId);
						vm.getData(vm.startId);
						console.log(vm.historyId);
					}else{
						console.log("没有更多数据了");
					}
				}else if(scrollTop + clientHeight >= scrollHeight && !vm.startId){
					jq(".nodata").remove();
					jq(".record-wrapper").append('<div class="nodata" style="text-align:center;color:white;line-height:1rem;">没有更多数据了</div>')
				}
			},
			getData(startId){
				let vm = this;
				this.$axios.get('shicai/record',{
					params:{
						type: 1,
						start_id: startId,
						limit: 5
					}
				}).then(res => {
					console.log(res.data);
					let obj = res.data;
					obj.data.record.forEach(function(item){
						vm.record.push(item);
					});
					vm.startId = obj.data.startId;
					vm.firstLoad = false;
				}).catch(err => {
					console.log(err);
				});
			},
			tab(){
				this.$store.state.isLotterty = false;
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
		background-position-y: 100%;
		.link-item{
			float: left;
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
	.type{
		display: flex;
		justify-content: space-between;
		width: 4rem;
	}
	.type:nth-child(2){
		border-top: 1px solid #12632C;
	}
	.type-2{
		margin-top: 6px;
		padding-top: 0.2rem;
	}
	.img-wrapper{
		overflow: hidden;
		position: relative;
		width: 2rem;
		height: 0.9rem;
		padding-left: 5px;
		img{
			float: left;
			width: 0.5rem;
			height: 0.5rem;
			margin-right: 0.18rem;
		}
		.point{
			position: absolute;
			bottom: 0;
			font-size: 12px;
			color: white;
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