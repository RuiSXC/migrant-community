<template>
    <div class="rating">
        <span v-for="star in 5" :key="star" class="star" :class="{ 'active': star <= modelValue }" @click="rate(star)">
            ★
        </span>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 接收父组件传来的 modelValue 值
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0,
    },
});

// 触发父组件更新 modelValue
const emit = defineEmits(['update:modelValue']);

const rate = (star) => {
    emit('update:modelValue', star);
};
</script>

<style>
.rating {
    display: flex;
}

.star {
    cursor: pointer;
    color: grey;
}

.star.active {
    color: gold;
}
</style>