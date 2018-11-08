<template>
	<div class="game-wrapper">
		<div class="sec-game game-1">
			<div class="user-point">床点: {{userPoint}}</div>
			<div class="game-time">
				<p class="time-title" v-if="minute===0 && second<5">正在开奖:</p>
				<p class="time-title" v-else>距离开奖:</p>
				<p class="time-counter">{{[minute,second] | formatTime}}</p>
			</div>
			<div class="my-bet">
				<p>我共押注<span> {{total_bet}} </span>床点</p>
				<div :class="['my-history',{active: history}]"></div>
			</div>
			<div class="last-result">
				<img :src="last_result_1">
				<img :src="last_result_2">
			</div>
			<div class="bet-type-1">
				<div class="content">
					<div class="content-row row-1">
						<div class="row-item" v-for="(item,t) in 6" 
							:class="{'active': t===bet_1}" @click="bet1(t)"></div>
					</div>
					<div class="content-row row-2">
						<div class="row-item" v-for="(item,t) in 6" 
							:class="{'active': t===bet_2}" @click="bet2(t)"></div>
					</div>
				</div>
				<div class="btn-wrapper btn-wrapper-1">
					<div class="btn btn-min" @click="min(1)"></div>
					<div class="counter">{{counter_1}}</div>
					<div class="btn btn-add" @click="add(1)"></div>
				</div>
			</div>
		</div>
		<div class="sec-game game-2 bet-type-2">
			<div class="number-wrapper">
				<div class="num-row">
					<div class="num-item" v-for="item in bonus" @click="sumBet()">
						<div class="num" :data-bonus="item"></div>
						<div class="bonus">
							<p>奖金</p>
							<p>{{item}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="btn-express">
				<div class="btn express-item" data-num="10" @click="express()"></div>
				<div class="btn express-item" data-num="100" @click="express()"></div>
				<div class="btn express-item" data-num="500" @click="express()"></div>
			</div>
			<div class="btn-wrapper btn-wrapper-2">
				<div class="btn btn-min" @click="min(2)"></div>
				<div class="counter">{{counter_2}}</div>
				<div class="btn btn-add" @click="add(2)"></div>
			</div>
		</div>
		<div class="rules"></div>
	</div>
</template>
<script>
	import jq from "jquery";
	import utils from "../assets/js/utils.js";
	export default{
		name: 'game',
		data(){
			return{
				userPoint: 0, //用户床点
				bet_1: -1, //第一位点数
				bet_2: -1, //第二位点数
				already_bet_1: false, //点数竞猜已下注
				already_bet_2: false, //和值竞猜已下注
				bet_count: 0, //点数竞猜下注统计
				sumBetCount: 0, //和值竞猜下注统计
				counter_1: 1, //点数竞猜 注数统计
				counter_2: 1, //和值竞猜 注数统计
				bonus: [1800,900,600,450,360,300,360,450,600,900,1800], //和值赔率 
				minute: 0, //分钟
				second: 0, //秒数
				timer: null, //时间定时器
				history: false, //记录是否有更新
				last_result_1: null, //上期开奖点数1
				last_result_2: null, //上期开奖点数2
				pool1:{
					first_num: 0,
					second_num: 0,
					total_count: 0
				},
				pool2:{
					first_num: 0,
					first_count: 0,
					second_num: 0,
					second_count: 0
				},
				temp: [], //临时数组
				total_bet: 0,
			}
		},
		mounted(){
			this.getData();
		},
		watch:{
			bet_count(){
				if(this.bet_count === 2){
					
				}else{
					this.$store.state.betTotal = 0;
				}
			},
			counter_1(){
				this.pool1.total_count = this.counter_1;
				if(this.bet_count === 2){
					this.stringifyPool1();
					this.$store.state.pool_one_active = true;
				}else{
					this.$store.state.betTotal = 0;
				}
			},
			counter_2(){
				let vm = this;
				vm.$store.state.sumTotal = 0;
				jq(".num.active").each(function(item){
					let bonus = parseInt(jq(this).data("bonus"));
					vm.$store.state.sumTotal += (vm.counter_2)*100;
				});
				this.stringifyPool2();
			},
			temp(){
				this.stringifyPool2();
				if(this.temp.length>0){
					this.$store.state.pool_two_active = true;
				}else{
					this.$store.state.pool_two_active = false;
				}
			}
		},
		methods:{
			/*获取初始数据*/
			getData(){
				let vm = this;
				this.$axios('shicai/list').then(res =>{
					console.log(res.data);
					let obj = res.data;
					if(obj.code == 1000){
						//用户床点
						this.userPoint = obj.data.bed_point;
						//已押床点
						if(obj.data.total_bet){
							this.total_bet += obj.data.total_bet;
						}
						//启动定时器
						this.minute = obj.data.left_time.minute;
						this.second = obj.data.left_time.second;
						this.setTimer(this.minute,this.second);
						// 判断是有记录更新
						this.history = (obj.data.new_count === 1)?true:false;
						//上期开点
						this.last_result_1 = require("../assets/image/"+obj.data.last_result.first_num+".png");
						this.last_result_2 = require("../assets/image/"+obj.data.last_result.second_num+".png");
						//期数
						this.$store.state.sc_id = obj.data.sc_id;
						// 用户已押点数竞猜
						if(obj.data.pool_one.first_num){
							this.already_bet_1 = true;
							this.pool1.first_num = obj.data.pool_one.first_num;
							this.pool1.second_num = obj.data.pool_one.second_num;
							this.pool1.total_count = this.counter_1;
							this.bet_count = 2;
							jq(".row-1").find(".row-item").eq(obj.data.pool_one.first_num-1).addClass('active');
							jq(".row-2").find(".row-item").eq(obj.data.pool_one.second_num-1).addClass('active');
							this.stringifyPool1();
						}
						//用户已押和值竞猜
						if(obj.data.pool_two.first_num){
							this.already_bet_2 = true;
							this.temp.splice(0,this.temp.length);
							this.temp.push(obj.data.pool_two.first_num);
							jq(".num-item").eq(obj.data.pool_two.first_num-2).find(".num").addClass('active');
							if(obj.data.pool_two.second_num){
								this.temp.push(obj.data.pool_two.second_num);
								jq(".num-item").eq(obj.data.pool_two.second_num-2).find(".num").addClass('active');
								this.sumBetCount = 2;
							}
							this.stringifyPool2();
						}
					}

				}).catch(err =>{
					console.log(err);
				});
			},
			/*初始化点数下注参数*/
			stringifyPool1(){
				this.$store.state.betTotal = this.counter_1 * 100;
				let jsonPool1 = JSON.stringify(this.pool1);
				this.$store.state.pool_one = jsonPool1;
				this.$store.state.submit = true;
				console.log(this.$store.state.pool_one);
			},
			/*初始化和值竞猜参数*/
			stringifyPool2(){
				let pool2 = {};
				if(this.temp.length == 2){
					pool2.first_num = this.temp[0];
					pool2.first_count = this.counter_2;
					pool2.second_num = this.temp[1];
					pool2.second_count = this.counter_2;
					
					let jsonPool2 = JSON.stringify(pool2);
					this.$store.state.pool_two = jsonPool2;
					this.$store.state.submit = true;
					console.log(this.$store.state.pool_two);
				}else{
					pool2.first_num = this.temp[0];
					pool2.first_count = this.counter_2;

					let jsonPool2 = JSON.stringify(pool2);
					this.$store.state.pool_two = jsonPool2;
					this.$store.state.submit = true;
					console.log(this.$store.state.pool_two);
				}
			},
			min(type){
				if(type === 1){
					if(this.counter_1>1){
						this.counter_1 --;
					}
				}else{
					if(this.counter_2>1){
						this.counter_2 --;
					}
				}
			},
			add(type){
				if(type === 1){
					this.counter_1 ++;
				}else{
					this.counter_2 ++;
				}
			},
			/*快速投注*/
			express(){
				this.counter_2 = parseInt(event.currentTarget.dataset.num);
			},
			/*点数竞猜 第一位*/
			bet1(index){
				if(this.already_bet_1){
					this.$store.state.mask = true;
					this.$store.state.tips_1 = true;
				}else{
					this.bet_1 = index;
					let $this = jq(event.currentTarget);
					if($this.hasClass('active')){
						$this.removeClass('active');
						this.bet_count -= 1;
						this.bet_count = (this.bet_count<0)?0:this.bet_count;
						this.$store.state.pool_one_active = false;
					}else{
						$this.addClass('active');
						this.bet_count += 1;
						this.bet_count = (this.bet_count>2)?2:this.bet_count;
						this.pool1.first_num = $this.index()+1;
						this.pool1.total_count = this.counter_1;
						if(this.bet_count === 2){
							this.stringifyPool1();
							this.$store.state.pool_one_active = true;
						}
					}
				}
			},
			/*点数竞猜 第二位*/
			bet2(index){
				if(this.already_bet_1){
					this.$store.state.mask = true;
					this.$store.state.tips_1 = true;
				}else{
					this.bet_2 = index;
					let $this = jq(event.currentTarget);
					if($this.hasClass('active')){
						$this.removeClass('active');
						this.bet_count -= 1;
						this.bet_count = (this.bet_count<0)?0:this.bet_count;
						this.$store.state.pool_one_active = false;
					}else{
						$this.addClass('active');
						this.bet_count += 1;
						this.bet_count = (this.bet_count>2)?2:this.bet_count;
						this.pool1.second_num = $this.index()+1;
						this.pool1.total_count = this.counter_1;
						if(this.bet_count === 2){
							this.stringifyPool1();
							this.$store.state.pool_one_active = true;
						}
					}
				}
			},
			/*和值竞猜*/
			sumBet(){
				if(this.already_bet_2){
					this.$store.state.mask = true;
					this.$store.state.tips_1 = true;
				}else{
					let $this = jq(event.currentTarget);
					let bonus = $this.find(".num").data("bonus"); //赔率
					let _index = 0;
					if($this.find(".num").hasClass('active')){
						$this.find(".num").removeClass('active');
						this.sumBetCount = (this.sumBetCount>0)?(--this.sumBetCount):0;
						this.$store.state.sumTotal -= this.counter_2 * 100;
						this.temp.forEach(function(item,index){
							if(item === $this.index()+2){
								_index = index;
							}
						});
						this.temp.splice(_index,1);
					}else{
						if(this.sumBetCount<2){
							this.sumBetCount ++;
							$this.find(".num").addClass('active');
							this.temp.push($this.index()+2);
							this.$store.state.sumTotal += this.counter_2 * 100;
						}else{
							console.log("该区间最多只能下选两注");	
						}
					}
				}

			},
			/*定时器*/
			setTimer(minute,second){
				let vm = this;
				clearInterval(this.timer);
				this.timer = setInterval(function(){
					if(vm.minute === 0 && vm.second ===0){
						window.location.reload(); 
					}
					if(vm.second === 0){
						vm.minute -= 1;
						vm.second = 60;
					}
					vm.second -= 1;
				},1000);
			}
		},
		/*过滤器*/
		filters:{
			formatTime([minute,second]){
				if(minute<10){
					minute = '0' + minute;
				}
				if(second<10){
					second = '0' + second;
				}
				return minute + '分' + second + '秒';
			}
		},
	}
</script>
<style lang="scss" scoped>
	.game-1{
		position: relative;
		width: 100%;
		height: 9.69rem;
		background: url("../assets/image/img-01.png") no-repeat;
		background-size: 100%;
	}
	.my-bet{
		position: absolute;
	    right: 0.2rem;
	    top: 4rem;
	    color: white;
	    font-size: 12px;
	    span{
	    	color: #FECC57;
	    }
	}
	.my-history{
		width: 1rem;
		height: 1rem;
		margin-top: 5px;
		margin-left: 0.3rem;
		background: url("../assets/image/history.png") no-repeat;
		background-size: 100% 200%;
		background-position-y: 0;
	}
	.my-history.active{
		background-position-y: 100%;
	}
	.last-result{
		position: absolute;
	    left: 0;
	    right: 0;
	    top: 2.8rem;
	    margin: auto;
	    width: 1.4rem;
	    height: 1.4rem;
	    display: flex;
	    align-items: flex-end;
	    justify-content: space-around;
	    transform: translateX(0.1rem);
	    img{
	    	width: 0.6rem;
	    	height: 0.61rem;
	    }
	}
	.user-point{
		position: absolute;
		left: 1rem;
	    top: 3.9rem;
	    width: 1.4rem;
	    height: 0.4rem;
	    padding: 0 0.1rem;
	    line-height: 0.4rem;
	    font-size: 12px;
		color: white;
		background: #208C4C;
		border-radius: 0.2rem;
		border: 1px solid rgba(17,77,41,0.5);
	}
	.game-time{
		position: absolute;
		left: 1rem;
		top: 4.5rem;
		width: 1.4rem;
		padding: 0 0.1rem;
		color: white;
		text-align: center;
		border-radius: 0.2rem;
		border: 1px solid rgba(17,77,41,0.5);
		background: #208C4C;
		p{
			line-height: 0.4rem;
		}
		.time-counter{
			color: #ee1b10;
		}
	}
	.bet-type-1{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 4.0562rem;
		background: url("../assets/image/img-02.png") no-repeat;
		background-size: 100%;
		.content{
			position: absolute;
			left: 4%;
			top: -0.24rem;
			width: 92%;
			height: 2.6rem;
		}
	}
	.content-row{
		display: flex;
		justify-content: space-between;
	}
	.row-2{
		margin-top: 0.46rem;
	}
	.row-item{
		width: 0.98rem;
		height: 1.04rem;
		background: url("../assets/image/dice.png") no-repeat;
		background-size: 600% 200%;
		background-position-y: 0;
	}
	.row-item.active{
		background-position-y: 100%;
	}
	.row-item:nth-child(1){
		background-position-x: 0;
	}
	.row-item:nth-child(2){
		background-position-x: 20%;
	}
	.row-item:nth-child(3){
		background-position-x: 40%;
	}
	.row-item:nth-child(4){
		background-position-x: 60%;
	}
	.row-item:nth-child(5){
		background-position-x: 80%;
	}
	.row-item:nth-child(6){
		background-position-x: 100%;
	}
	.btn-wrapper{
		display: flex;
		justify-content: space-between;
		position: absolute;
		left: 0;
		right: 0;
		margin: auto;
		width: 2.8rem;
	}
	.btn-wrapper-1{
		bottom: 0.15rem;
	}
	.btn-wrapper-2{
		bottom: 0.3rem;
	}
	.btn{
		width: 0.8rem;
		height: 0.8rem;
		background: url("../assets/image/btns.png") no-repeat;
		background-size: 500% 100%;
		cursor: pointer;
	}
	.btn-min{
		background-position-x: 0;
	}
	.btn-add{
		background-position-x: 25%;
	}
	.counter{
		width: 1rem;
		text-align: center;
		line-height: 0.8rem;
		color: white;
		font-weight: bold;
		font-size: 16px;
	}
	.game-2{
		position: relative;
		width: 100%;
		height: 6.85rem;
		background: url("../assets/image/img-03.png") no-repeat;
		background-size: 100%;
	}
	.number-wrapper{
		position: relative;
		top: 0.7rem;
		width: 96%;
		height: 3.5rem;
		margin-left: 2%;
	}
	.num-row{
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 100%;
		
	}
	.num-row-2{
		width: 88%;
		margin: 0 auto;
	}
	.num-item{
		width: 1.2rem;
		.num{
			width: 0.84rem;
			height: 0.84rem;
			margin: 8% auto;
			background: url("../assets/image/num.png") no-repeat;
			background-size: 1100% 200%;
			background-position-y: 1px;
		}
		.bonus{
			text-align: center;
			color: #033804;
			font-size: 12px;
			line-height: 1.2;
			font-weight: bold;
		}
	}
	.num-item:nth-child(1)>.num{
		background-position-x: 0;
	}
	.num-item:nth-child(2)>.num{
		background-position-x: 10%;
	}
	.num-item:nth-child(3)>.num{
		background-position-x: 20%;
	}
	.num-item:nth-child(4)>.num{
		background-position-x: 30%;
	}
	.num-item:nth-child(5)>.num{
		background-position-x: 40%;
	}
	.num-item:nth-child(6)>.num{
		background-position-x: 50%;
	}
	.num-item:nth-child(7)>.num{
		background-position-x: 60%;
	}
	.num-item:nth-child(8)>.num{
		background-position-x: 70%;
	}
	.num-item:nth-child(9)>.num{
		background-position-x: 80%;
	}
	.num-item:nth-child(10)>.num{
		background-position-x: 90%;
	}
	.num-item:nth-child(11)>.num{
		background-position-x: 100%;
	}
	.num.active{
		background-position-y: 100%;
	}
	.btn-express{
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: 1.3rem;
		left: 0;
		right: 0;
		width: 4.6rem;
		height: 0.8rem;
		margin: auto;
	}
	.express-item:nth-child(1){
		background-position-x: 50%;
	}
	.express-item:nth-child(2){
		background-position-x: 75%;
	}
	.express-item:nth-child(3){
		background-position-x: 100%;
	}
	.rules{
		width: 100%;
		height: 4.21rem;
		background: url("../assets/image/img-04.png") no-repeat;
		background-size: 100%;
	}


	@media screen and (max-width: 320px) {
	    .game-time{
	    	p{
	    		font-size: 12px;
	    	}
	    }
	}
</style>