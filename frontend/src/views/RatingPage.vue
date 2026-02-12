<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api/client'
import { useAuthStore } from '../stores/auth'

const leaderboard = ref<any[]>([])
const loading = ref(true)
const score = ref(0)
const auth = useAuthStore()

async function load() {
  try {
    const { data } = await api.get('/rating')
    leaderboard.value = data
  } catch (e) {
    console.error(e)
  }
}

onMounted(load)

async function addScore() {
  if (score.value < 1 || score.value > 10) return
  try {
    await api.post('/rating', { score: score.value })
    await load()
    score.value = 0
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div>
    <h1>Рейтинг</h1>
    <p style="margin-bottom: 1rem;">Имена отображаются по ИИН (для активности)</p>
    <div v-if="auth.token" class="card" style="margin-bottom: 1rem;">
      <h3>Добавить балл</h3>
      <input v-model.number="score" type="number" min="1" max="10" placeholder="1-10" style="max-width: 100px; margin-right: 0.5rem;" />
      <button @click="addScore" class="primary">Добавить</button>
    </div>
    <p v-if="loading">Загрузка...</p>
    <div v-else class="card">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <th style="text-align: left; padding: 0.5rem;">#</th>
            <th style="text-align: left; padding: 0.5rem;">Имя</th>
            <th style="text-align: left; padding: 0.5rem;">Средний балл</th>
            <th style="text-align: left; padding: 0.5rem;">Количество</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in leaderboard" :key="r.userId" style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 0.5rem;">{{ i + 1 }}</td>
            <td style="padding: 0.5rem;">{{ r.displayName }}</td>
            <td style="padding: 0.5rem;">{{ r.avgScore?.toFixed(1) }}</td>
            <td style="padding: 0.5rem;">{{ r.count }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!leaderboard.length" style="padding: 1rem;">Нет данных</p>
    </div>
  </div>
</template>
