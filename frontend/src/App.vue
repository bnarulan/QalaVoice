<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'

const route = useRoute()
const auth = useAuthStore()
const { user } = storeToRefs(auth)

function logout() {
  auth.logout()
}
</script>

<template>
  <div id="app">
    <header class="header" v-if="route.name !== 'Login' && route.name !== 'Register'">
      <router-link to="/">Лента</router-link>
      <router-link to="/complaint">Добавить жалобу</router-link>
      <router-link to="/rating">Рейтинг</router-link>
      <router-link to="/admin" v-if="user?.role === 'ADMIN'">Админ</router-link>
      <router-link to="/admin/register" v-if="user?.role === 'ADMIN'">Регистрация</router-link>
      <span>
        <template v-if="!auth.token">
          <router-link to="/login">Вход</router-link>
        </template>
        <button @click="logout" v-else>Выход</button>
      </span>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
