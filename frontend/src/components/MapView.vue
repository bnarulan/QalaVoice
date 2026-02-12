<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  markers?: { lat: number; lng: number; label?: string }[]
  center?: [number, number]
  zoom?: number
  clickable?: boolean
}>()
const emit = defineEmits<{ mapClick: [e: { latlng: { lat: number; lng: number } }] }>()

const mapEl = ref<HTMLElement | null>(null)
let map: any = null
let L: any = null
let markersLayer: any = null

async function initMap() {
  if (!mapEl.value) return
  const leaflet = await import('leaflet')
  L = leaflet.default
  map = L.map(mapEl.value).setView(props.center || [51.16, 71.45], props.zoom || 10)
  if (props.clickable) {
    map.on('click', (e: any) => emit('mapClick', e))
  }
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map)
  markersLayer = L.layerGroup().addTo(map)
  updateMarkers()
}

function updateMarkers() {
  if (!L || !markersLayer) return
  markersLayer.clearLayers()
  ;(props.markers || []).forEach((m) => {
    L.marker([m.lat, m.lng])
      .addTo(markersLayer)
      .bindPopup(m.label || '')
  })
}

onMounted(initMap)
watch(() => props.markers, updateMarkers, { deep: true })
watch(() => props.center, (c) => { if (map && c) map.setView(c, props.zoom || 10) }, { deep: true })
</script>

<template>
  <div ref="mapEl" class="leaflet-container"></div>
</template>
