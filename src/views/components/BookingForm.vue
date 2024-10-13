<template>
    <h2 class="text-center fw-bold pt-3">Booking Form</h2>
    <el-form :model="form" class="py-4" :rules="rules" ref="formRef" label-width="10rem">
        <el-form-item label="Full name" prop="name">
            <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Number of guests" prop="guests">
            <el-input v-model.number="form.guests" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Date and time" prop="time">
            <el-date-picker v-model="form.time" type="datetime" placeholder="Pick a date and time" style="width: 100%" required />
        </el-form-item>
        <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
            <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="Notes">
            <el-input v-model="form.notes" type="textarea" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">Submit</el-button>
            <el-button @click="onCancel">Cancel</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { postBooking, sendBookingEmail } from '@/stores/reservation';

const form = ref({
    name: '',
    guests: 1,
    time: '',
    email: '',
    phone: '',
    notes: '',
});

const rules = ref({
    name: [
        { required: true, message: 'Please input your name', trigger: 'blur' },
    ],
    guests: [
        { required: true, message: 'Please input number of guests', trigger: 'blur' },
        { type: 'number', message: 'Must be a number', trigger: 'blur' },
    ],
    time: [
        { type: 'date', required: true, message: 'Please select a time', trigger: 'change' },
    ],
    email: [
        { required: true, message: 'Please input email address', trigger: 'blur' },
        { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] },
    ],
    phone: [
        { required: true, message: 'Please input phone number', trigger: 'blur' },
    ],
});

const formRef = ref(null);

const onSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (!valid) return ElMessage.error('Please correct the form.');
        postBooking(form.value)
            .then(() => ElMessage.success('Booking created successfully!'))
            .catch((error) => ElMessage.error(error.message));
    });
};

const onCancel = () => {
    formRef.value.resetFields();
};
</script>
