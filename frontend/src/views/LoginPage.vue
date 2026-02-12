<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const iin = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(iin.value, password.value)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card" style="max-width: 400px; margin: 2rem auto;">
    <h1>Вход</h1>
    <form @submit.prevent="submit" style="margin-top: 1rem;">
      <input v-model="iin" type="text" placeholder="ИИН" maxlength="12" required style="margin-bottom: 0.75rem;" />
      <input v-model="password" type="password" placeholder="Пароль" required style="margin-bottom: 0.75rem;" />
      <p v-if="error" style="color: red; margin-bottom: 0.5rem;">{{ error }}</p>
      <button type="submit" class="primary" :disabled="loading">Войти</button>
    </form>
    <p style="margin-top: 1rem;"><router-link to="/register">Нет аккаунта? Регистрация</router-link></p>
  </div>
</template>
