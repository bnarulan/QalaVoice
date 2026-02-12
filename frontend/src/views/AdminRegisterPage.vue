<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/client'

const iin = ref('')
const fullName = ref('')
const password = ref('')
const role = ref('RESIDENT')
const sphere = ref('general')
const loading = ref(false)
const error = ref('')
const success = ref('')
const router = useRouter()

const SPHERES = [
  { value: 'general', label: 'Общее' },
  { value: 'roads', label: 'Дороги' },
  { value: 'housing', label: 'ЖКХ' },
  { value: 'parks', label: 'Парки' },
  { value: 'light', label: 'Освещение' },
]

async function submit() {
  error.value = ''
  success.value = ''
  if (!iin.value.trim() || !fullName.value.trim() || !password.value) {
    error.value = 'Заполните все поля'
    return
  }
  loading.value = true
  try {
    await api.post('/auth/register', {
      iin: iin.value,
      fullName: fullName.value,
      password: password.value,
      role: role.value,
      sphere: role.value === 'EXECUTOR' ? sphere.value : undefined,
    })
    success.value = 'Пользователь зарегистрирован'
    iin.value = ''
    fullName.value = ''
    password.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 style="padding: 1rem 1.25rem;">Регистрация (только админ)</h1>
    <div class="feed-card">
      <form @submit.prevent="submit">
        <div style="margin-bottom: 1rem;">
          <label>ИИН *</label>
          <input v-model="iin" type="text" maxlength="12" required />
        </div>
        <div style="margin-bottom: 1rem;">
          <label>ФИО *</label>
          <input v-model="fullName" type="text" required />
        </div>
        <div style="margin-bottom: 1rem;">
          <label>Пароль *</label>
          <input v-model="password" type="password" required />
        </div>
        <div style="margin-bottom: 1rem;">
          <label>Роль</label>
          <select v-model="role" style="padding: 0.5rem;">
            <option value="RESIDENT">Житель</option>
            <option value="EXECUTOR">Исполнитель</option>
          </select>
        </div>
        <div v-if="role === 'EXECUTOR'" style="margin-bottom: 1rem;">
          <label>Сфера</label>
          <select v-model="sphere" style="padding: 0.5rem;">
            <option v-for="s in SPHERES" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>
        <p v-if="error" style="color: red;">{{ error }}</p>
        <p v-if="success" style="color: green;">{{ success }}</p>
        <button type="submit" class="primary" :disabled="loading">Зарегистрировать</button>
      </form>
    </div>
  </div>
</template>
