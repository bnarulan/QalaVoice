<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/client'

const hotSpots = ref<any[]>([])
const stats = ref<any>({})
const loading = ref(true)
const mapRef = ref<HTMLElement | null>(null)
let map: any = null
let L: any = null

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/dashboard')
    hotSpots.value = data.hotSpots || []
    stats.value = data.stats || {}
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }

  const leaflet = await import('leaflet')
  L = leaflet.default
  if (mapRef.value && L) {
    map = L.map(mapRef.value).setView([51.16, 71.45], 10)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map)

    hotSpots.value.forEach((h) => {
      L.marker([h.lat, h.lng])
        .addTo(map)
        .bindPopup(`<b>${h.address}</b><br>Событий: ${h.count}`)
    })
  }
})
</script>

<template>
  <div>
    <h1 style="padding: 1rem 1.25rem;">Админ-панель</h1>
    <p v-if="loading">Загрузка...</p>
    <div v-else>
      <div class="feed-card" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem;">
        <div><strong>Исполнителей:</strong> {{ stats.executorsTotal }}</div>
        <div><strong>Активных:</strong> {{ stats.executorsActive }}</div>
        <div><strong>Занятых:</strong> {{ stats.executorsBusy }}</div>
        <div><strong>Свободных:</strong> {{ stats.executorsFree }}</div>
        <div><strong>Жалоб всего:</strong> {{ stats.postsTotal }}</div>
        <div><strong>Ожидают:</strong> {{ stats.postsSubmitted }}</div>
        <div><strong>В работе:</strong> {{ stats.postsInProgress }}</div>
        <div><strong>Выполнено:</strong> {{ stats.postsDone }}</div>
      </div>
      <div class="feed-card">
        <h3>Горячие точки</h3>
        <div ref="mapRef" class="leaflet-container" style="margin: 1rem 0;"></div>
        <ul style="list-style: none;">
          <li v-for="(h, i) in hotSpots" :key="i" style="padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
            <strong>{{ h.address }}</strong> — {{ h.count }} событий
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
