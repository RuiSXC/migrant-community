<template>
  <el-tabs type="border-card" class="my-3">
    <el-tab-pane label="User">
        <UserTable />
    </el-tab-pane>
    <el-tab-pane label="Booking">Booking</el-tab-pane>
    <el-tab-pane label="Comment">Comment</el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import UserTable from './components/UserTable.vue';
</script>
