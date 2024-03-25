<template lang="">
    <div>
        
    </div>
</template>
<script setup>

    const props = defineProps({
	changeLoadingMessage: {
		type: Function,
		default: () => {},
	},
	actorInScene: {
		// 由viewerMain中的显示按钮进行调节,用于各种actor是否应该在屏幕中
		type: Object,
		default: () => ({
			upper: false, // 全上颌牙显示/隐藏
			lower: false, // 全下颌牙显示/隐藏
			teethWithGingiva: 2, // 牙齿+牙龈0/牙齿1/牙龈2
			axis: false, // 坐标轴显示/隐藏
			arch: 2, // 牙弓线显示01/隐藏23, 托槽显示02/隐藏13
		}),
	},
	selectedWidget: String,
	resetSelectedWidget: {
		type: Function,
		default: () => {},
	},
});

</script>
<style lang="">
    
</style>