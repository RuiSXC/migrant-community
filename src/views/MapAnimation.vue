<template>
    <!-- map to chart -->
    <div>
        <div class="container col-xxl-10 px-4 py-5">
            <div class="row flex-lg-row-reverse align-items-center g-5 py-5">

                <div class="col-lg-6">
                    <h2 class=" fw-bold lh-1 mb-3">Where Are Migrant People Living in Australia?
                    </h2>
                    <p class="lead">This interactive chart provides a high-level overview of how migrant  people are
                        distributed across Australia's states and territories. Starting with a map, you can watch as it
                        transitions into a bar plot, breaking down the number of migrant  people living in each region.
                        This gives you a clear picture of the larger migrant populations in specific states. Explore how
                        different areas contribute to Australia's vibrant, multicultural landscape.</p >
                    <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="echarts-box mt-n4">
                        <div ref="mapCharts" @mouseover="mouseOver()" @mouseout="mouseOut()" style="width: 100%; height: 400px"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted, ref } from 'vue';
import throttle from 'lodash/throttle';  // 如果需要使用 lodash 的 throttle

const mapCharts = ref()
let mouseOut, mouseOver;
let timeID = null;
let myChart = null;

onMounted(() => {
    myChart = echarts.init(mapCharts.value);

    fetch('https://gist.githubusercontent.com/GerardoFurtado/02aa65e5522104cb692e/raw/8108fbd4103a827e67444381ff594f7df8450411/aust.json')
      .then(r => r.json()).then((Australia) => {
        echarts.registerMap('AUS', Australia);
        var data = [
            { name: 'Victoria', value: 914283 },
            { name: 'ACT', value: 460280 },
            { name: 'Northern Territory', value: 19666 },
            { name: 'Queensland', value: 516051 },
            { name: 'South Australia', value: 1805848 },
            { name: 'Tasmania', value: 30796 },
            { name: 'Western Australia', value: 387138 },
            { name: 'New South Wales', value: 1070764 },
        ];

        data.sort(function (a, b) {
            return a.value - b.value;
        });

        const mapOption = {
            visualMap: {
                show: false,
                left: 'right',
                inRange: {
                    color: "#409EFF"
                },
            },
            legend: {
                show: false
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2
            },
            series: [
                {
                    id: 'population',
                    name: 'Migrant Count:',
                    type: 'map',
                    roam: false,
                    map: 'AUS',
                    animationDurationUpdate: 1000,  // 减少动画时间
                    universalTransition: true,
                    data: data,
                    nameProperty: 'STATE_NAME',
                }
            ]
        };

        const barOption = {
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter: function (value) {
                        return (value / 1000000) + 'M';  // 将值除以 100 万并加上 "M"
                    }
                }
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    rotate: 30
                },
                data: data.map(item => item.name)
            },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2
            },
            animationDurationUpdate: 1000,  // 减少动画时间
            series: {
                type: 'bar',
                color: "#409EFF",
                id: 'population',
                data: data.map(function (item) {
                    return item.value;
                }),
                universalTransition: true
            }
        };

        let currentOption = mapOption;

        mouseOver = () => {
            if (timeID) {
                clearInterval(timeID);
                timeID = null;
            }
        };

        mouseOut = () => {
            if (timeID === null) {
                currentOption = currentOption === mapOption ? barOption : mapOption;
                myChart.setOption(currentOption, true);
                timeID = setInterval(function () {
                    currentOption = currentOption === mapOption ? barOption : mapOption;
                    myChart.setOption(currentOption, true);
                }, 3000);  // 更长的切换时间
            }
        };

        myChart.setOption(mapOption);
        timeID = setInterval(function () {
            currentOption = currentOption === mapOption ? barOption : mapOption;
            myChart.setOption(currentOption, true);
        }, 3000);  // 更长的切换时间

        window.addEventListener('resize', throttle(() => myChart.resize(), 200));
    });
});

onUnmounted(() => {
    if (timeID) {
        clearInterval(timeID);
        timeID = null;
    }
    if (myChart) {
        myChart.dispose();  // 销毁图表实例
    }
});
</script>