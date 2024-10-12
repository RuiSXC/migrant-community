<template>
    <div class="row my-3 p-3 bg-light">
        <div class="col-md-6">
            <h3>Safety Insight</h3>
            <p class="text-muted">
                You can customize their data view through multiple filtering and searching options, including filtering
                by year and searching by local government area and suburb name.
            </p>
        </div>

        <!-- 搜索和过滤区域 -->
        <div class="col-md-6 d-flex flex-column justify-content-end filter-container gap-2">
            <el-input v-model="filters.localGovernmentArea" placeholder="Search by Local Government Area" clearable
                @clear="() => filters.localGovernmentArea = ''"></el-input>
            <el-input v-model="filters.suburbTownName" placeholder="Search by Suburb/Town Name" clearable
                @clear="() => filters.suburbTownName = ''"></el-input>
            <el-select v-model="filters.year" placeholder="Filter by Year" clearable @clear="()=> filters.year = null">
                <el-option v-for="year in uniqueYears" :key="year" :label="year" :value="year" />
            </el-select>
        </div>
    </div>

    <div>
        <!-- 表格 -->
        <el-table :data="paginatedData" stripe border style="width: 100%" @sort-change="handleSortChange">
            <el-table-column prop="year" label="Year" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="localGovernmentArea" label="Local Government Area" width="200"></el-table-column>
            <el-table-column prop="postcode" label="Postcode" width="150"></el-table-column>
            <el-table-column prop="suburbTownName" label="Suburb/Town Name" width="200"></el-table-column>
            <el-table-column prop="offenceCount" label="Offence Count" sortable="custom"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="filteredData.length"
            layout="total, prev, pager, next" @current-change="handlePageChange" class="py-1"></el-pagination>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 导入 useRoute
import offences from '@/assets/json/offences.json'; // 假设 offences.json 在 src/assets 目录下

// 定义筛选条件
const filters = ref({
    localGovernmentArea: '',
    suburbTownName: '',
    year: null,
});

// 当前页和每页显示的条数
const currentPage = ref(1);
const pageSize = ref(10);

// 排序设置
const sortConfig = ref({
    prop: null,
    order: null,
});

// 处理排序变化
const handleSortChange = ({ prop, order }) => {
    sortConfig.value = { prop, order };
};

// 清除所有过滤条件
const clearFilters = () => {
    filters.value.localGovernmentArea = '';
    filters.value.suburbTownName = '';
    filters.value.year = null;
};

// 根据filters进行数据筛选
const filteredData = computed(() => {
    return offences.filter((offence) => {
        const matchesLGA =
            filters.value.localGovernmentArea === '' ||
            offence.localGovernmentArea
                .toLowerCase()
                .includes(filters.value.localGovernmentArea.toLowerCase());
        const matchesSuburb =
            filters.value.suburbTownName === '' ||
            offence.suburbTownName
                .toLowerCase()
                .includes(filters.value.suburbTownName.toLowerCase());
        const matchesYear =
            filters.value.year === null || offence.year === filters.value.year;

        return matchesLGA && matchesSuburb && matchesYear;
    });
});

// 处理分页数据
const paginatedData = computed(() => {
    let sortedData = [...filteredData.value];

    // 处理排序
    if (sortConfig.value.prop) {
        sortedData.sort((a, b) => {
            const prop = sortConfig.value.prop;
            const order = sortConfig.value.order === 'ascending' ? 1 : -1;

            if (a[prop] > b[prop]) {
                return order;
            } else if (a[prop] < b[prop]) {
                return -order;
            } else {
                return 0;
            }
        });
    }

    // 分页
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedData.slice(start, end);
});

// 处理页码变化
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

// 获取所有不重复的年份
const uniqueYears = computed(() => {
    const years = offences.map((offence) => offence.year);
    return [...new Set(years)].sort((a, b) => b - a);
});

// 获取路由参数
const route = useRoute();

// 在组件挂载时应用查询参数
onMounted(() => {
    const { localGovernmentArea, suburbTownName, year } = route.query;

    if (localGovernmentArea) {
        filters.value.localGovernmentArea = localGovernmentArea;
    }
    if (suburbTownName) {
        filters.value.suburbTownName = suburbTownName;
    }
    if (year) {
        filters.value.year = parseInt(year);
    }
});
</script>
