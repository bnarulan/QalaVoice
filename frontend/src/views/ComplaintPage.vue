<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/client'
import MapView from '../components/MapView.vue'

const content = ref('')
const address = ref('')
const lat = ref<number | null>(null)
const lng = ref<number | null>(null)
const sphere = ref('general')
const loading = ref(false)
const error = ref('')
const stream = ref<MediaStream | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const capturedPhotos = ref<string[]>([])
const videoFile = ref<File | null>(null)
const VIDEO_MAX_MB = 50
const router = useRouter()
const mapCenter = ref<[number, number]>([51.16, 71.45])
const showMapPicker = ref(false)

const SPHERES = [
  { value: 'general', label: 'Общее' },
  { value: 'roads', label: 'Дороги' },
  { value: 'housing', label: 'ЖКХ' },
  { value: 'parks', label: 'Парки и зелёные зоны' },
  { value: 'light', label: 'Освещение' },
]

onMounted(() => {
  getLocation()
})

async function getLocation() {
  if (!navigator.geolocation) {
    address.value = 'Геолокация недоступна'
    return
  }
  try {
    const pos = await new Promise<GeolocationPosition>((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true }),
    )
    lat.value = pos.coords.latitude
    lng.value = pos.coords.longitude
    mapCenter.value = [lat.value, lng.value]
    await reverseGeocode(lat.value, lng.value)
  } catch {
    address.value = 'Не удалось определить адрес'
  }
}

async function reverseGeocode(la: number, ln: number) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${la}&lon=${ln}`)
    const data = await r.json()
    address.value = data.display_name || `${la.toFixed(6)}, ${ln.toFixed(6)}`
  } catch {
    address.value = `${la.toFixed(6)}, ${ln.toFixed(6)}`
  }
}

function onMapClick(e: any) {
  if (!showMapPicker.value) return
  lat.value = e.latlng.lat
  lng.value = e.latlng.lng
  mapCenter.value = [e.latlng.lat, e.latlng.lng]
  reverseGeocode(e.latlng.lat, e.latlng.lng)
}

async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoRef.value) videoRef.value.srcObject = stream.value
  } catch (e) {
    error.value = 'Нет доступа к камере'
  }
}

function stopCamera() {
  stream.value?.getTracks().forEach((t) => t.stop())
  stream.value = null
}

function capturePhoto() {
  if (!videoRef.value || !canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  canvasRef.value.width = videoRef.value.videoWidth
  canvasRef.value.height = videoRef.value.videoHeight
  ctx.drawImage(videoRef.value, 0, 0)
  capturedPhotos.value.push(canvasRef.value.toDataURL('image/jpeg'))
}

function removePhoto(i: number) {
  capturedPhotos.value.splice(i, 1)
}

function onPhotoUpload(e: Event) {
  const el = e.target as HTMLInputElement
  const files = el.files
  if (!files?.length) return
  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) continue
    const reader = new FileReader()
    reader.onload = () => {
      capturedPhotos.value.push(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  el.value = ''
}

function onVideoSelect(e: Event) {
  const el = e.target as HTMLInputElement
  const file = el.files?.[0]
  if (!file) return
  if (file.size > VIDEO_MAX_MB * 1024 * 1024) {
    error.value = `Видео должно быть до ${VIDEO_MAX_MB} МБ`
    return
  }
  videoFile.value = file
}

async function submit() {
  error.value = ''
  if (!content.value.trim()) {
    error.value = 'Введите описание'
    return
  }
  if (!address.value) {
    error.value = 'Определите адрес'
    return
  }
  loading.value = true
  try {
    const { data: post } = await api.post('/posts', {
      content: content.value,
      address: address.value,
      lat: lat.value ?? undefined,
      lng: lng.value ?? undefined,
      type: 'COMPLAINT',
      sphere: sphere.value,
    })

    for (const photoData of capturedPhotos.value) {
      if (photoData.startsWith('data:')) {
        const blob = await (await fetch(photoData)).blob()
        const form = new FormData()
        form.append('file', blob, 'photo.jpg')
        await api.post(`/posts/${post.id}/photo`, form)
      }
    }

    if (videoFile.value) {
      const form = new FormData()
      form.append('file', videoFile.value)
      await api.post(`/posts/${post.id}/video`, form)
    }

    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Ошибка'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 style="padding: 1rem 1.25rem;">Добавить жалобу</h1>
    <div class="feed-card">
      <p><strong>Адрес:</strong> {{ address || 'Определение...' }}</p>
      <div style="margin-top: 0.5rem;">
        <button @click="getLocation" type="button">Автоопределение</button>
        <button @click="showMapPicker = !showMapPicker" type="button" style="margin-left: 0.5rem;">
          {{ showMapPicker ? 'Выбрать на карте' : 'Выбрать на карте' }}
        </button>
      </div>
      <div v-if="showMapPicker" style="margin-top: 1rem;">
        <MapView :center="mapCenter" :clickable="true" @map-click="onMapClick" :markers="lat && lng ? [{ lat: lat!, lng: lng!, label: address }] : []" />
        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--gray);">Кликните на карте для выбора места</p>
      </div>

      <div style="margin-top: 1rem;">
        <label>Сфера</label>
        <select v-model="sphere" style="margin-top: 0.25rem; padding: 0.5rem;">
          <option v-for="s in SPHERES" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>

      <div style="margin-top: 1rem;">
        <label>Описание *</label>
        <textarea v-model="content" rows="4" required style="margin-top: 0.25rem;"></textarea>
      </div>

      <div style="margin-top: 1rem;">
        <h4>Фото</h4>
        <input type="file" accept="image/*" multiple @change="onPhotoUpload" style="margin-bottom: 0.5rem;" />
        <button v-if="!stream" @click="startCamera" type="button">Сделать фото</button>
        <div v-else>
          <video ref="videoRef" autoplay playsinline style="max-width: 100%; border-radius: 8px;"></video>
          <div style="margin-top: 0.5rem;">
            <button @click="capturePhoto" type="button">Сфотографировать</button>
            <button @click="stopCamera" type="button">Выключить камеру</button>
          </div>
        </div>
        <canvas ref="canvasRef" style="display: none;"></canvas>
        <div v-if="capturedPhotos.length" class="media-grid" style="margin-top: 0.5rem;">
          <div v-for="(p, i) in capturedPhotos" :key="i" style="position: relative;">
            <img :src="p" style="height: 80px; border-radius: 8px;" />
            <button @click="removePhoto(i)" type="button" style="position: absolute; top: 0; right: 0;">×</button>
          </div>
        </div>
      </div>

      <div style="margin-top: 1rem;">
        <h4>Видео (до {{ VIDEO_MAX_MB }} МБ)</h4>
        <input type="file" accept="video/*" @change="onVideoSelect" />
        <p v-if="videoFile">{{ videoFile.name }}</p>
      </div>

      <p v-if="error" style="color: red; margin-top: 0.5rem;">{{ error }}</p>
      <button @click="submit" class="primary" style="margin-top: 1rem;" :disabled="loading">
        {{ loading ? 'Отправка...' : 'Отправить жалобу' }}
      </button>
    </div>
  </div>
</template>
