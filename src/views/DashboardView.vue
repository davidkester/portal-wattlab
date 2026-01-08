<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import MapLeaflet from '../components/MapLeaflet.vue'
import GroupsList from '../components/GroupsList.vue'
import DataSummary from '../components/DataSummary.vue'
import { useMqttClient } from '../composables/useMqttClient'
import DygraphComponent from '../components/DygraphComponent.vue'

import { useTelemetryStore } from '../stores/telemetryStore'



const count = ref(0);
const data = ref({});

let options = {
  port: 18083, //process.env.MQTT_PORT,
  username: 'wattlab', //process.env.MQTT_USER,
  password: 'qUD1URebxUQJAd0L' //process.env.MQTT_PASSWORD
}

useMqttClient(options);

const telemetry = useTelemetryStore();

const pv = ref([]);
const grid = ref([]);
const selected = ref([]);

const updateData = function(){
	console.log('update Data');
}

const updateSelected = async function(org, kind, id){
	selected.value = [org, kind, id];
	console.log(dates.value);
	pv.value = await telemetry.getChannelDataById(1, 2, 1, Math.floor(dates.value[0] / 1000), Math.floor(dates.value[1] / 1000));
  grid.value = await telemetry.getChannelDataById(1, 1, undefined, Math.floor(dates.value[0] / 1000), Math.floor(dates.value[1] / 1000));
}

const gridData = computed(() => {
	return grid.value.map(item => {
  	return [new Date(item.ts), item.p[0], item.p[1], item.p[2]]
  })
})

const pvData = computed(() => {
	return pv.value.map(item => {
  	return [new Date(item.ts), item.p[0], item.p[1], item.p[2]]
  })
})

const start = new Date();
start.setDate(start.getDate() - 5);
start.setHours(0, 0, 0, 0);

const end = new Date();
end.setHours(23, 59, 59, 999);

const dates = ref([ start.getTime(), end.getTime() ]);


onMounted(async () => {
  //telemetry.fetchSnapshot();
	console.log(dates.value);
  pv.value = await telemetry.getChannelDataById(1, 2, 1);
  grid.value = await telemetry.getChannelDataById(1, 1);

  //data4graph.value = grid.value.map(item => {
 // 	return [new Date(item.ts), item.p[0], item.p[1], item.p[2]]
  //})


})

</script>

<template>

  <!-- Top Bar -->
  <Navbar />

   <main class="max-w-7xl mx-auto p-4 space-y-4">	  
<!--
			<div class="flex gap-2 items-center">
	    	<span class="text-xs text-slate-500">Status: {{ telemetry.state.status }}
	    		<span v-if="telemetry.state.error"> · {{ telemetry.state.error }}</span>
	    	</span>
	    </div>

	    <div>
	    	{{ telemetry.latest }}
	  	</div>

	    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
	      <div class="bg-white/70 rounded-2xl border border-slate-200 shadow-lg p-0 lg:col-span-2">
	        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
	          <h2 class="font-semibold">Vessel Position</h2>
	          <div class="text-xs text-slate-500">OpenStreetMap · Leaflet</div>
	        </div>
	        <MapLeaflet class="h-80" />
	      </div>

	      <div class="bg-white/70 rounded-2xl border border-slate-200 shadow-lg p-0">
	        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
	          <h2 class="font-semibold">Solar Groups</h2>
	          <div class="text-xs text-slate-500">RCBO / Relay state</div>
	          
	        </div>
	      	<GroupsList class="p-4" />

	      </div>
	    </section>

   	-->
   	 <div class="bg-white/70 rounded-2xl border border-slate-200 shadow-lg p-0 lg:col-span-2">
      SELECTED: {{selected}}
    </div>


   	<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="bg-white/70 rounded-2xl border border-slate-200 shadow-lg p-0">
        <DygraphComponent :data="gridData"/>
      </div>

      <div class="bg-white/70 rounded-2xl border border-slate-200 shadow-lg p-0">
        <DygraphComponent :data="pvData"/>
      </div>
    </div>


	    <section class="">
	      <div class="bg-white/70 rounded-2xl border border-slate-200 shadow-lg p-0 lg:col-span-2">
	        <DataSummary @change="updateSelected"/>
	      </div>
	    </section>

	    <VueDatePicker 
	    	v-model="dates" 
	    	auto-apply
	    	:range="{ maxRange: 7 }" 
	    	:formats="{ input: 'dd/MM/yyyy' }"
	    	:time-config="{ enableTimePicker: false }" 
	    	:action-row="{ showPreview: false }"
	    	:max-date="new Date(new Date().setHours(23, 59, 59, 999))"
	    />

	    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="updateData">
				Update
			</button>

	  </main>

	  


    <Footer />

</template>

<style>
.chart {
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
  padding: 12px;
}

/* Make the legend look like a floating info card */
.legend {
  font-family: ui-sans-serif, system-ui;
  font-size: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 14px;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 10px 22px rgba(0,0,0,0.06);
}


/* Typography */
.dygraph-axis-label,
.dygraph-label {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  font-size: 12px;
  color: rgba(0,0,0,0.72);
}

.dygraph-legend {
  width: auto !important;
  min-width: 150px;
  color: white;
  background-color: #BABABA !important;
  padding-left: 5px;
  padding-right :5px;
  border-color: #BABABA;
  border-style: solid;
  border-width: thin;
  transition: 0s 4s;
  z-index: 80 !important;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, .3);
  border-radius: 3px;
}

</style>

