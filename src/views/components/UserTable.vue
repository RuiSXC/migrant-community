<template>
    <div>
        <!-- 用户表格 -->
        <el-table :data="users" stripe border style="width: 100%" @selection-change="handleSelectionChange">
            <!-- 复选框 -->
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="email" label="Email"></el-table-column>
            <el-table-column prop="role" label="Role"></el-table-column>
            <el-table-column label="Operations">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                        Edit
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        Delete
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 发送消息控制面板 -->
        <div style="margin-top: 20px;">
            <el-input v-model="message" placeholder="Enter your message" type="textarea" :rows="4"></el-input>
            <el-button style="margin-top: 10px;" type="primary" @click="sendEMessage"
                :disabled="selectedUsers.length === 0">
                Send Message
            </el-button>
        </div>

        <!-- 编辑用户对话框 -->
        <el-dialog v-model="userDialogVisible" title="User Info">
            <el-form :model="currentUser" label-width="5rem">
                <el-form-item label="Email">
                    <el-input v-model="currentUser.email" />
                </el-form-item>
                <el-form-item label="Role">
                    <el-select v-model="currentUser.role" placeholder="Select Role">
                        <el-option label="User" value="user" />
                        <el-option label="Admin" value="admin" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveUserInfo">Submit</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchUsers, saveUser, deleteUser } from '@/stores/user';
import { getFunctions, httpsCallable } from 'firebase/functions'; // 引入firebase functions

const users = ref([]);
const selectedUsers = ref([]); // 存储选中的用户
const message = ref(""); // 消息内容
const userDialogVisible = ref(false);
const currentUser = ref(null);

// 获取用户数据
const updateUsers = async () => {
    fetchUsers()
        .then((data) => {
            console.log(data)
            users.value = data
        })
        .catch((error) => ElMessage.error(error.message));
};

// 处理复选框选择变化
const handleSelectionChange = (selectedRows) => {
    selectedUsers.value = selectedRows;
};

// 处理编辑
const handleEdit = (index, row) => {
    currentUser.value = { ...row };
    userDialogVisible.value = true;
};

// 处理删除
const handleDelete = (index, row) => {
    if (confirm("Are you sure you want to delete this user?") === false) return;
    deleteUser(row.id).then(() => {
        ElMessage.success("User deleted successfully");
        updateUsers();
    });
};

// 保存用户信息
const saveUserInfo = () => {
    saveUser(currentUser.value)
        .then(() => {
            ElMessage.success("User updated successfully");
            userDialogVisible.value = false;
            updateUsers();
        })
        .catch((error) => ElMessage.error(error.message));
};

// 发送消息
const sendEMessage = () => {
    if (!message.value.trim()) {
        return ElMessage.error("Message cannot be empty");
    }

    // 获取选中的用户邮箱列表
    const emails = selectedUsers.value.map((user) => user.email);
    if (emails.length === 0) {
        return ElMessage.error("No users selected");
    }

        // 调用Firebase云函数sendMessage
        const functions = getFunctions(); // 获取firebase functions实例
        const sendMessage = httpsCallable(functions, 'sendMessage'); // 调用函数名

        sendMessage({
            email: emails,
            subject: 'New message from Migrant Comunity',
            message: message.value,
        });

        ElMessage.success("Message sent successfully!");
};

onMounted(updateUsers);
</script>