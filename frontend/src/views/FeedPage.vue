<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../api/client'
import MapView from '../components/MapView.vue'
import { useAuthStore } from '../stores/auth'

const posts = ref<any[]>([])
const loading = ref(true)
const auth = useAuthStore()

const mapMarkers = computed(() =>
  posts.value
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({ lat: p.lat, lng: p.lng, label: p.address }))
)

const mapCenter = ref<[number, number]>([51.16, 71.45])

onMounted(async () => {
  try {
    const { data } = await api.get('/posts')
    posts.value = data.posts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapCenter.value = [pos.coords.latitude, pos.coords.longitude]
        },
        () => {},
      )
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function toggleLike(post: any) {
  if (!auth.token) return
  try {
    const { data } = await api.post('/likes', { postId: post.id })
    post._count = post._count || {}
    post._count.likes = (post._count.likes || 0) + (data.liked ? 1 : -1)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div>
    <h1 style="padding: 1rem 1.25rem; font-size: 1.25rem;">Лента</h1>
    <div v-if="mapMarkers.length" class="feed-card">
      <h3 style="margin-bottom: 0.5rem;">Карта событий</h3>
      <MapView :markers="mapMarkers" :center="mapCenter" />
    </div>
    <p v-if="loading" style="padding: 2rem;">Загрузка...</p>
    <div v-else>
      <article v-for="p in posts" :key="p.id" class="feed-card">
        <p style="color: var(--gray); font-size: 0.9rem;">{{ p.address }}</p>
        <p style="margin-top: 0.5rem; white-space: pre-wrap;">{{ p.content }}</p>
        <div v-if="p.media?.length" class="media-grid">
          <img v-for="m in p.media.filter((x: any) => x.type === 'PHOTO')" :key="m.id" :src="`/api${m.url}`" />
          <video v-for="m in p.media.filter((x: any) => x.type === 'VIDEO')" :key="m.id" :src="`/api${m.url}`" controls />
        </div>
        <div v-if="p.statusHistory?.length" class="status-timeline">
          <div v-for="(s, i) in p.statusHistory" :key="i">• {{ s.status }}</div>
        </div>
        <p v-if="p.executor" style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--blue);">
          Исполнитель: {{ p.executor.user?.fullName }}
        </p>
        <div class="actions-bar">
          <button @click="toggleLike(p)" :style="{ color: 'var(--gray)' }">
            ♥ {{ p._count?.likes || 0 }}
          </button>
          <router-link :to="`/post/${p.id}`" style="color: var(--gray);">💬 {{ p.comments?.length || 0 }}</router-link>
        </div>
        <p style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--gray);">{{ new Date(p.createdAt).toLocaleString('ru') }}</p>
      </article>
      <p v-if="!posts.length" style="padding: 2rem; text-align: center; color: var(--gray);">Нет постов</p>
    </div>
  </div>
</template>
