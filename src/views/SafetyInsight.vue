<template>
    <div class="row my-3 p-3 bg-light">
        <div class="col-md-6">
            <h3>
                Safety Insight
                <button @click="exportExcel" class="btn btn-outline-success btn-sm ms-2" title="Export to Excel">
                    <i class="bi bi-download"></i>
                </button>
            </h3>
            <p class="text-muted">
                You can customize their data view through multiple filtering and searching options, including filtering
                by year and searching by local government area and suburb name.
            </p>
        </div>

        <!-- Search and Filter -->
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
        <!-- Table -->
        <el-table :data="paginatedData" stripe border style="width: 100%" @sort-change="handleSortChange">
            <el-table-column prop="year" label="Year" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="localGovernmentArea" label="Local Government Area" width="200"></el-table-column>
            <el-table-column prop="postcode" label="Postcode" width="150"></el-table-column>
            <el-table-column prop="suburbTownName" label="Suburb/Town Name" width="200"></el-table-column>
            <el-table-column prop="offenceCount" label="Offence Count" sortable="custom"></el-table-column>
        </el-table>

        <!-- Pagination -->
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="filteredData.length" :pager-count="5"
            layout="total, prev, pager, next" @current-change="handlePageChange" class="py-1"></el-pagination>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 导入 useRoute
import * as XLSX from 'xlsx';
import offences from '@/assets/json/offences.json'; // 假设 offences.json 在 src/assets 目录下

// define the filters
const filters = ref({
    localGovernmentArea: '',
    suburbTownName: '',
    year: null,
});

// the numbers of the current page and page size
const currentPage = ref(1);
const pageSize = ref(10);

// define the sort config
const sortConfig = ref({
    prop: null,
    order: null,
});

// handle sort change
const handleSortChange = ({ prop, order }) => {
    sortConfig.value = { prop, order };
};

// filter data based on filters
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

// get paginated data
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

    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedData.slice(start, end);
});

// handle page change
const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

// get unique years
const uniqueYears = computed(() => {
    const years = offences.map((offence) => offence.year);
    return [...new Set(years)].sort((a, b) => b - a);
});

// export to excel
const exportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Offences Data");
  XLSX.writeFile(workbook, "offences_data.xlsx");
};



// 在组件挂载时应用查询参数
const route = useRoute();
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
