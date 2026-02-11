<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Dygraph from 'dygraphs'

const props = defineProps(['data'])

const graphEl = ref<HTMLDivElement | null>(null)
const legendEl = ref<HTMLDivElement | null>(null)

let dygraph: Dygraph | null = null

function buildLabels(data: (string | number)[][]) {
  if (!data || data.length === 0) return ["Time"]

  const seriesCount = data[0].length - 1
  const labels = ["Time"]

  for (let i = 1; i <= seriesCount; i++) {
    labels.push(`G${i}`)
  }

  return labels
}

function formatData(data: (string | number)[][]) {
  return data.map(row => [
    new Date(row[0] as string),
    ...row.slice(1)
  ])
}

function createGraph(data: (string | number)[][]) {
  if (!graphEl.value) return

  dygraph = new Dygraph(
    graphEl.value,
    formatData(data),
    {
      labels: buildLabels(data),

      stepPlot: true,          // important for ON/OFF
      fillGraph: true,
      fillAlpha: 0.2,
      strokeWidth: 2,
      drawPoints: false,

      legend: "never",
      labelsDiv: legendEl.value ?? undefined,

      axes: {
        y: {
          valueRange: [0, 1.2]
        }
      },

      colors: [
        "#2563EB",
        "#F59E0B",
        "#16A34A",
        "#EF4444",
        "#8B5CF6",
        "#06B6D4"
      ],

      gridLineColor: "rgba(0,0,0,0.08)",
      axisLineColor: "rgba(0,0,0,0.18)",
      axisLabelColor: "rgba(0,0,0,0.72)",
    }
  )
}

onMounted(() => {

  createGraph(props.data);
  /*
  if (props.data?.length) {
    createGraph(props.data)
  }
  */
})

watch(
  () => props.data,
  (newData) => {

    if (!dygraph || !newData?.length) return

    console.log('watch', buildLabels(newData));

    dygraph.updateOptions({
      file: formatData(newData),
      labels: buildLabels(newData)
    })
  }
)

onBeforeUnmount(() => {
  dygraph?.destroy()
})

</script>

<template>
  <div style="width: 100%;">
    <div ref="graphEl" style="width: 100%; height: 300px;"></div>
    <div ref="legendEl" style="margin-top: 8px; font-size: 14px;"></div>
  </div>

</template>
