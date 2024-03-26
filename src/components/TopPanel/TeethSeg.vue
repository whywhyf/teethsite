<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: YeYangfan
 * @Date: 2024-03-3 
 * @LastEditors: YeYangfan
 * @LastEditTime: 2024-03-3 
-->

<template>
	<div class="main-block panel" :class="{ show: isShow }">
		<div class="title-box">
			<div class="text">
				<div class="bg icon-finetune" />
				<span>牙齿分割</span>
			</div>
			<div class="exit">
				<div class="icon-exit bg" @click="exitToolPanel()" />
			</div>
		</div>
		<div class="handle-box">
			<div class="handle-title">选择</div>
			<div class="handle-body">
				<div class="half clear-fix">
					<div
						class="teeth-type-button"
						:class="{
							activate: dentalArchAdjustType === 'upper',
							disabled: !arrangeTeethType.includes('upper'),
						}"
						@click="updateDentalArchAdjustType('upper')"
					>
						上颌
					</div>
				</div>
				<div class="half">
					<div
						class="teeth-type-button"
						:class="{
							activate: dentalArchAdjustType === 'lower',
							disabled: !arrangeTeethType.includes('lower'),
						}"
						@click="updateDentalArchAdjustType('lower')"
					>
						下颌
					</div>
				</div>
			</div>
		</div>
		<div class="handle-box">
			<div class="handle-title">牙齿分割</div>
			<div class="handle-body">
				<div class="half clear-fix">
					<button
						class="handle-btn teeth-type-button"
						@click="segmentTooth()"
					>
						分割
					</button>
				</div>
			</div>
		</div>
		<div class="handle-box">
			<div class="handle-title">状态操作</div>
			<div class="handle-body">
				<div class="half clear-fix">
					<button
						class="handle-btn teeth-type-button"
						:class="{ disabled: false }"
						@click="resetTeethRootParams()"
					>
						switch
					</button>
				</div>
				<div class="half clear-fix">
					<button class="handle-btn teeth-type-button" @click="resetTeethRoot()">
						push
					</button>
				</div>
			</div>
		</div>
        <div class="handle-box">
			<div class="handle-title">人工微调</div>
			<div class="handle-body">
				<div class="half clear-fix">
					<button
						class="handle-btn teeth-type-button"
						:class="{ disabled: false }"
						@click="resetTeethRootParams()"
					>
						undo
					</button>
				</div>
				<div class="half clear-fix">
					<button class="handle-btn teeth-type-button" @click="resetTeethRoot()">
						redo
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useStore } from "vuex";
import { reactive, ref, toRaw, computed, watch, onMounted, defineProps, inject } from "vue";
import ViewerMain from "../ViewerComponent/ViewerMain.vue";
import Viewer from "../../pages/Viewer.vue"
import {
    setTokenHeader,
    setUserIdHeader,
    sendRequestWithToken,
} from "../../utils/tokenRequest";

//定义组件元素属性
const props = defineProps({
	isShow: {
		type: Boolean,
		default: false,
	},
	exitToolPanel: {
		type: Function,
		default: () => {},
	},
});

const store = useStore();
const arrangeTeethType = computed(() => store.getters["userHandleState/arrangeTeethType"]);
const dentalArchAdjustType = computed(() => store.state.actorHandleState.teethArrange.dentalArchAdjustRecord.teethType);

/**
 * @description: 这里直接复用了牙弓线调整面板中的选择模块
 * @param {*} value 上/下颌
 * @return {*}
 * @author: ZhuYichen
 */
function updateDentalArchAdjustType(value) {
	// dentalArchAdjustType.value = value;
	store.dispatch("actorHandleState/updateDentalArchAdjustRecord", {
		teethType: value,
	});
}

/**
 * @description: 取消生成的牙根，回到调整方向的状态
 * @return {*}
 * @author: ZhuYichen
 */
function resetTeethRoot() {
	if(dentalArchAdjustType.value=='upper'){
		store.dispatch("actorHandleState/updateGenerateRootRecord", {
			upper: false,
		});
	}else if(dentalArchAdjustType.value=='lower'){
		store.dispatch("actorHandleState/updateGenerateRootRecord", {
			lower: false,
		});
	}
}
const generateRootRecord = computed(() => store.state.actorHandleState.generateRootRecord);


// ------------------------------------------------------------------------------------------------
// 发送牙齿分割信号
// ------------------------------------------------------------------------------------------------
function segmentTooth(){
	store.dispatch("actorHandleState/updateSegmentFlag", true)
	console.log('segmentfalg:', store.state.actorHandleState.segmentFlag)
}

/**
 * @description: 重置牙根方向参数
 * @return {*}
 * @author: ZhuYichen
 */
function resetTeethRootParams() {
	// 保存参数, 覆盖牙弓线和bracketMatrix
	if(dentalArchAdjustType.value=='upper'){
		store.dispatch("actorHandleState/setInitRootFlag", {
			upper: true,
		});
	}else if(dentalArchAdjustType.value=='lower'){
		store.dispatch("actorHandleState/setInitRootFlag", {
			lower: true,
		});
	}
}

</script>

<style lang="scss" scoped>
@import "panelStyle.scss";
</style>
