<!-- src/components/GroupsList.vue -->
<script setup lang="ts">

import { ref, onMounted, computed } from 'vue'
import { useTelemetryStore } from '../stores/telemetryStore'

const telemetry = useTelemetryStore()
const groups = computed(() => telemetry.groups)

const channels = ref([]);

const emit = defineEmits(['change'])

type Group = { id: number; name: string; rcbo: boolean; relay: boolean }

//const props = defineProps<{ groups: Group[] }>()

function rcboClass(tripped: boolean) {
  return tripped ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
}
function relayClass(on: boolean) {
  return on ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
}


onMounted(async () => {
  channels.value = await telemetry.getChannelsByInstallationId(1);
  
  //console.log(channels)
})


</script>

<template>
  <div class="grid gap-3">

    <table class="min-w-full">
      <thead>
        <tr>
          <th class="px-4 py-3 text-left">Name</th>
          <th class="px-4 py-3 text-left">Kind</th>
        </tr>
      </thead>
      <tbody v-for="(item) in channels">
        <tr @click="emit('change', 2, item.kind_id, item.id)">
          <td class="px-4 py-3">{{item.name}}</td>
          <td class="px-4 py-3">{{item.kind}}</td>
        </tr>
      </tbody>
    </table>


  </div>

</template>