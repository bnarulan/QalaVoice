<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/client'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const post = ref<any>(null)
const commentText = ref('')
const loading = ref(true)
const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.token)

onMounted(async () => {
  try {
    const { data } = await api.get(`/posts/${route.params.id}`)
    post.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const commentError = ref('')
async function addComment() {
  if (!commentText.value.trim()) return
  commentError.value = ''
  try {
    await api.post('/comments', { postId: post.value.id, content: commentText.value })
    commentText.value = ''
    const { data } = await api.get(`/posts/${route.params.id}`)
    post.value = data
  } catch (e: any) {
    commentError.value = e.response?.data?.message || 'Ошибка'
  }
}
</script>

<template>
  <div>
    <router-link to="/" style="margin-bottom: 1rem; display: inline-block;">← Назад к ленте</router-link>
    <p v-if="loading">Загрузка...</p>
    <div v-else-if="post" class="card">
      <p><strong>Адрес:</strong> {{ post.address }}</p>
      <p style="margin-top: 0.5rem;">{{ post.content }}</p>
      <div v-if="post.media?.length" style="margin-top: 1rem;">
        <img v-for="m in post.media.filter((x: any) => x.type === 'PHOTO')" :key="m.id" :src="`/api${m.url}`" style="max-width: 100%; height: auto; border-radius: 8px; margin-right: 0.5rem; margin-bottom: 0.5rem;" />
        <video v-for="m in post.media.filter((x: any) => x.type === 'VIDEO')" :key="m.id" :src="`/api${m.url}`" controls style="max-width: 100%; border-radius: 8px; margin-top: 0.5rem;"></video>
      </div>
      <div v-if="post.statusHistory?.length" class="status-timeline">
        <div v-for="(s, i) in post.statusHistory" :key="i">• {{ s.status }}</div>
      </div>
      <p v-if="post.executor" style="margin-top: 0.5rem; color: var(--blue);">Исполнитель: {{ post.executor.user?.fullName }}</p>
      <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--gray);">{{ new Date(post.createdAt).toLocaleString('ru') }}</p>

      <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #e5e7eb;" />
      <h3>Комментарии</h3>
      <div v-for="c in post.comments" :key="c.id" style="padding: 0.75rem; background: #f9fafb; border-radius: 8px; margin-top: 0.5rem;">
        <p>{{ c.content }}</p>
        <p style="font-size: 0.8rem; color: #9ca3af;">{{ new Date(c.createdAt).toLocaleString('ru') }}</p>
      </div>
      <div v-if="isLoggedIn" style="margin-top: 1rem;">
        <textarea v-model="commentText" placeholder="Добавить комментарий (один на пост)..." rows="3" style="margin-bottom: 0.5rem;"></textarea>
        <p v-if="commentError" style="color: red; font-size: 0.9rem;">{{ commentError }}</p>
        <button @click="addComment" class="primary">Отправить</button>
      </div>
    </div>
  </div>
</template>
