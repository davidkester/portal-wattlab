<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted, ref, watch } from 'vue'
// import { useTelemetry } from '@/composables/useTelemetry'

const mapEl = ref<HTMLDivElement|null>(null)
let map: L.Map
let marker: L.Marker

const { meta } = {}//useTelemetry()

onMounted(() => {
  map = L.map(mapEl.value as HTMLDivElement, { zoomControl: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)
  marker = L.marker([52.37, 4.9]).addTo(map)
  map.setView([52.37, 4.9], 7)
})

/*
watch(() => meta.value.position, (pos) => {
  if (!pos || typeof pos.lat !== 'number' || typeof pos.lon !== 'number') return
  const latlng = L.latLng(pos.lat, pos.lon)
  marker.setLatLng(latlng)
  if (map.getCenter().distanceTo(latlng) > 5000) map.setView(latlng, 11)
  else map.panTo(latlng, { animate: true })
})
*/
</script>

<template>
  <div ref="mapEl" class="w-full h-full rounded-b-2xl"></div>
</template>
