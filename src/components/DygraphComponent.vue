<!-- src/components/DygraphComponent.vue -->
<script setup lang="ts">

import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import Dygraph from 'dygraphs';

const props = defineProps(['data'])
const graph = ref(null);
let dygraph = null;

function formatPower(v) {
  const av = Math.abs(v);
  if (av >= 1_000_000) return (v / 1_000_000).toFixed(2) + " MW";
  if (av >= 1_000)     return (v / 1_000).toFixed(2) + " kW";
  return v.toFixed(0) + " W";
}

function legendFormatter(data) {
  if (data.x == null) {
    // Not hovering: show just labels
    //return data.series.map(s => s.label).join("  |  ");
    return data.series.map(s => s.label).join("  |  ");
  }
  const t = new Date(data.xHTML).toLocaleString();
  const parts = data.series.map(s => {
    if (!s.isVisible) return null;
    const v = s.yHTML != null ? Number(s.yHTML).toFixed(1) : "—";
    return `${s.label}: ${v}`;
  }).filter(Boolean);

  return `${t}  —  ${parts.join("  |  ")}`;
}

let config = {
  fillGraph: true,
  labels: [ "Time", "ø 1", "ø 2", "ø 3"],
  //xlabel: "Time (UTC)",
  //ylabel: "Power (kW)",
  //yAxisLabelWidth: 60,
  drawPoints: false,
  axes: {
    x: {
      drawGrid: false
    },
    y: {
      valueRange: [0, null],
      valueFormatter: function(v) {
        return v;
      },
      axisLabelFormatter: function(v) {
        return v;
      },
    }
  },
  fillAlpha: 0.14,
  legend: "never",
  labelsDiv: document.getElementById("legend"),
  //labelsSeparateLines: false,
  legendFormatter,
  strokeWidth: 2.2,
  gridLineColor: "rgba(0,0,0,0.08)",
  axisLineColor: "rgba(0,0,0,0.18)",
  axisLabelColor: "rgba(0,0,0,0.72)",
  //pixelsPerLabel: 70,
  //showRangeSelector: false,
  //rangeSelectorHeight: 28,
  //rangeSelectorPlotStrokeWidth: 1,
  rangeSelectorPlotFillColor: "rgba(0,0,0,0.06)",

  colors: ["#2563EB", "#F59E0B", "#16A34A"],
  rollPeriod: 6, 
  //showRoller: false, 
  //errorBars: false
}



onMounted(() => {

  dygraph = new Dygraph(
    graph.value,
    props.data,
    config
  )

})

watch(
  () => props.data,
  (newData) => {
    if (dygraph) {
      dygraph.updateOptions({ file: newData })
    }
  },
  { deep: false } // important, see below
)

onBeforeUnmount(() => {
  dygraph?.destroy()
})


</script>

<template>
  <div ref="graph" style="min-width: 100%; max-height: 100%;"></div>
  <div id="legend" class="legend" v-if="false"></div>
</template>