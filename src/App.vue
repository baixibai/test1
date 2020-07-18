<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {}
}

</script>

<style lang="scss">

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
    background: #e6ebf0;
    min-width: 1200px;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
    background: #ffffff;
	padding: 10px;
	//border:1px solid #dfe6ec;
    margin-bottom: 20px;
    margin-top: 0px;
    padding-bottom: 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>