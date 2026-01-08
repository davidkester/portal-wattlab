<!-- src/components/GroupsList.vue -->
<script setup lang="ts">

import { computed } from 'vue'
import { useTelemetryStore } from '../stores/telemetryStore'

const telemetry = useTelemetryStore()
const groups = computed(() => telemetry.groups)

type Group = { id: number; name: string; rcbo: boolean; relay: boolean }

//const props = defineProps<{ groups: Group[] }>()

function rcboClass(tripped: boolean) {
  return tripped ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
}
function relayClass(on: boolean) {
  return on ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="grid gap-3">
    <div v-if="!groups.value?.length" class="text-sm text-slate-500">
      No group data...
    </div>

    <div v-for="g in groups.value" :key="g.id ?? g.name" class="flex items-center justify-between p-3 rounded-xl border border-slate-200">

      <div class="font-medium">{{ g.name }}</div>
      <div class="flex items-center gap-2 text-xs">
        <span class="px-2 py-1 rounded" :class="rcboClass(g.rcbo)">
          RCBO: {{ g.rcbo ? 'TRIPPED' : 'OK' }}
        </span>
        <span class="px-2 py-1 rounded" :class="relayClass(g.relay)">
          Relay: {{ g.relay ? 'ON' : 'OFF' }}
        </span>
      </div>

    </div>
  </div>


</template>