<template>
	<el-row class="container homeindex">
		<el-col :span="24" class="header">
            <el-col :span="10" class="logo logo-width">
                LOGO
            </el-col>
			<el-col :span="4">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="10" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner" style="margin-right:20px;">客服热线：</span>
					<span class="el-dropdown-link userinfo-inner" style="margin-right:20px;" @click="hrefcompany()">{{userinfo.enter_name}}</span>
					<span class="el-dropdown-link userinfo-inner" style="margin-right:20px;" @click="hrefacc()">{{userinfo.name}}</span>
					<span class="el-dropdown-link userinfo-inner" style="margin-right:20px;">
						<a @click="logout" style="color:#fff">退出</a>
					</span>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<div class="titleRoute">
					<div class="titleRouteLEE" v-if="!collapsed">
						<el-dropdown placement="bottom-start" @command="hanleClick" trigger="hover">
							<span class="el-dropdown-link">
								<span>ERP管理系统</span>
								<i style="color: #abb0b5;" class="el-icon-caret-bottom el-icon--left"></i>
							</span>
						</el-dropdown>
					</div>
				</div>
                <el-menu  :default-openeds="openeds" class="el-menu-vertical-demo" id='menuid' @open="handleopen" @close="handleclose" @select="handleselect" v-show="!collapsed">
                    <template v-for="(item,index) in menu">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title">{{item.name}}</template>
                            <el-menu-item v-for="(child,key) in item.menu"  @click="oldRoute(child,item)" :class="($route.path.split('/')[1]==child.url.split('/')[1] && $route.path.split('/')[2]==child.url.split('/')[2] && $route.path.split('/')[1] != 'user') 
								|| ($route.path.split('/')[1] == 'user' && $route.path.split('/')[2] == 'client' && $route.path.split('/')[3]==child.url.split('/')[3]) ? 'is-active':'no-active'" :index="child.url" :key="key">{{child.name}}</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.menu.length>0" :index="item.menu[0].url"><i :class="item.iconCls"></i>{{item.menu[0].url}}</el-menu-item>
                    </template>
                </el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
					</li>
				</ul>
			</aside>
			<section class="content-container" id="bodyvue">
				<div class="grid-content bg-purple-light">
					<!-- <strong class="title">{{$route.name}}</strong> -->
                    <el-card class="box-card navcard"  shadow="never" style="margin: -20px;margin-bottom: 0px;border-radius: 0px;">
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-card>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	export default {
		data() {
			return {
				sysName:'ERP管理系统',
				collapsed:false,
				sysUser: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				status: false,
				openeds: [],
				userinfo: global.userinfo,
                frist: false,
                radio: '1',
                menu:[],
                oldurl:process.env.Gourl,
                erpurl:process.env.Gourlerp,
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen(key, keyPath) {
			},
			handleclose(key, keyPath) {
				// console.log(key, keyPath);
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				let apiUrl = process.env
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					window.location.href = apiUrl.Loginurl+'/logout'
				}).catch(() => {

				});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
				document.getElementById('menuid').style.width='100%';
			},
			showMenu(i,status){
				// this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			//获取权限
			requestLogin(){
				let params = {}
				let _this = this;
			    this.$fetch(this.$getApi('Account_info'),params).then((res) => {
		    		_this.userinfo = res.data
					global.userinfo = res.data
				})
			},

            //获取路由
            requestrouter(){
				// this.requestLogin()
                let _this = this;
                this.menu = JSON.parse(localStorage.getItem("menu"))
                this.menu = [
                	{
                		menu: [
                			{
                				name: "新建订单",
								sort: "1",
								type: "4",
								url: "/basedata/address"
							}
						],
						module_type: "2",
						name: "客服中心",
						sort: "7"
					} 
                ]
				// this.menu.some((role,index)=>{
				// 	_this.openeds.push(index.toString())
				// 	role.menu.some((res,i)=>{
				// 		if(global.currRouter.split('/')[1] == res.url.split('/')[1]){
				// 			return true
				// 		}
				// 	})
				// })
            },
            // 跳转到老系统
            oldRoute(val,menu){
				let _this = this
			    if((val.type== 3 ||val.type== 5) && val.url.substr(0,7) !== '/client'){
					window.location.href = `/erp/#${val.url}`
                }else if ((val.type== 3 || val.type== 5) && val.url.substr(0,7) === '/client'){
					window.location.href = val.url
                    // location.href = this.oldurl +  val.url
                }else if (val.type== 4){
                    this.$router.push({
                        path: val.url
                    })
					this.menu.some((role,index)=>{
						if(menu.sort == role.sort){
							_this.openeds.push[index.toString()]
							return true
						}
					})
					_this.openeds = this.$Base.uniqarr(_this.openeds)
					// window.location.href = `/erpdp/#${val.url}`
                    // location.href = this.oldurl +  val.url
                }else{
                    location.href = this.oldurl +  val.url
                }
            },
			hanlemouseleave () {
				this.status = false
			},
			hanlemouseover () {
				this.status = true
			},
			hanleClick (val) {
				if (parseInt(val) === 0) {
					window.location.href = '/client/price'
				}
			},
			hrefcompany(){
				window.open(this.oldurl + "/client/staff"); 
			},
			hrefacc(){
				window.open(this.oldurl + "/client/user/account"); 
			}
		},
		mounted() {
            this.requestrouter()
		}
	}

</script>

<style scoped lang="scss">

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: #2F70CF;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
            .logo {
                height:60px;
                font-size: 22px;
                padding-left:20px;
                /*padding-right:20px;*/
                /*border-color: rgba(238,241,146,0.3);*/
                /*border-right-width: 1px;*/
                /*border-right-style: solid;*/
                /*img {*/
                /*    width: 40px;*/
                /*    float: left;*/
                /*    margin: 10px 10px 10px 18px;*/
                /*}*/
                .txt {
                    color:#fff;
                }
            }
            .logo-width{
                width:230px;
                line-height: 60px;
            }
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				.el-menu{
					height: 98%;
                    overflow: auto;
                    cursor: pointer;
                    padding-bottom: 100px;
                    cursor: pointer;
                    border-right:none;
                    .el-menu-item{
                        font-size: 12px;
                        height: 35px;
                        line-height: 35px;
                    }
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
                overflow-y: none;
				flex:0 0 230px;
				width: 230px;
                /*padding-bottom: 100px;*/
                border-right: 1px solid #ebeef5;
                -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
			}
			.content-container {
				flex:1;
				padding: 20px;
                overflow-y: scroll;
                overflow-x: hidden;
				.breadcrumb-container {
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					box-sizing: border-box;
					margin-top:20px;
				}
			}
		}
		.el-breadcrumb, .el-dropdown{
			font-size: 12px;
		}
		.titleRoute {
			height: 70px;
			// width: 100%;
			line-height: 70px;
			background: #fff;
			// padding: 0 5%;
			padding-left: 20px;
			.titleRouteLEE {
				width: 90%;
				height: 69px;
				line-height: 69px;
				background: #fff;
				border-bottom: 1px solid #ccc;
				.el-dropdown {
					width: 100%;
					height: 40px;
					line-height: 40px;
					text-align: center;
					font-size: 18px;
					font-weight: bold;
					color: #222;
					border-radius: 2px;
					&:hover{
						background: #e6ebf0;
					}
					.el-dropdown-link {
						cursor: pointer;
					}
					.el-dropdown-menu,.el-popper {
						.popper__arrow {
							display: none !important;
						}
					}
				}
			}
		}
		.MenuRoute {
			position: fixed;
			left: 0;
			top: 110px;
			z-index: 9999;
			width: 230px;
			height: 100%;
			background:#fff;
			.menuRouteLinkText {
				color: #4c545e;
				font-size: 14px;
				font-weight: bold;
				padding-left: 10px;
				margin-top: 5px;
				cursor: pointer;
				line-height: 50px;
				&:hover {
					background-color: #e6ebf0;
				}
				i {
					float: right;
					margin-right: 10px;
					line-height: 50px;
				}
			}
		}
	}
    .dfKprD {
        width: 60px;
        height: 20px;
    }
    .navcard{
        border: none;
    }
    .el-submenu .el-menu .is-active.no-active{
        color: #303133;
        background: #fff;
    }
    .el-submenu .el-menu .is-active.no-active.el-menu-item:before{
        background: #E9EEF3;
    }

	@-webkit-keyframes slideInLeft {
	from {
		-webkit-transform: translate3d(-100%, 0, 0);
		transform: translate3d(-100%, 0, 0);
		visibility: visible;
	}

	to {
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
	}
	}

	@keyframes slideInLeft {
	from {
		-webkit-transform: translate3d(-100%, 0, 0);
		transform: translate3d(-100%, 0, 0);
		visibility: visible;
	}

	to {
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
	}
	}

	.slideInLeft {
	-webkit-animation-name: slideInLeft;
	animation-name: slideInLeft;
	}


.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.animated.delay-1s {
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}

.animated.delay-2s {
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
}

.animated.delay-3s {
  -webkit-animation-delay: 3s;
  animation-delay: 3s;
}

.animated.delay-4s {
  -webkit-animation-delay: 4s;
  animation-delay: 4s;
}

.animated.delay-5s {
  -webkit-animation-delay: 5s;
  animation-delay: 5s;
}

.animated.fast {
  -webkit-animation-duration: 800ms;
  animation-duration: 800ms;
}

.animated.faster {
  -webkit-animation-duration: 500ms;
  animation-duration: 500ms;
}

.animated.slow {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
}

.animated.slower {
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
}

@media (print), (prefers-reduced-motion) {
  .animated {
    -webkit-animation: unset !important;
    animation: unset !important;
    -webkit-transition: none !important;
    transition: none !important;
  }
}

	
</style>
