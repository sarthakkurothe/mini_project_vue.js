<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <div class="flex h-[700px] relative">

      <!-- Left Banner -->
      <div
        class="w-1/2 bg-cover bg-center"
        :style="{ backgroundImage: `url(${bannerImage})`, filter: 'brightness(0.8)' }"
      ></div>

      <!-- Right Hero Section -->
      <div
        class="w-1/2 flex items-center justify-center relative"
        :style="{ backgroundImage: `url(${patternImage})`, backgroundSize: 'cover' }"
      >
        <div class="text-center max-w-xl px-6">

          <!-- Hero Title -->
          <h1 class="text-5xl font-bold mb-6 leading-tight">
            <span class="gradient-text">Investment Portfolio</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-gray-600 text-xl font-medium mt-6" :key="currentSubtitleIndex">
            {{ subtitles[currentSubtitleIndex] }}
          </p>

          <!-- CTA -->
          <div class="mt-8">
            <GradientButton @click="goToClients">
              Get Started
            </GradientButton>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GradientButton from '../components/GradientButton.vue';
import bannerImage from '../assets/banner.png';
import patternImage from '../assets/pattern.png';

const router = useRouter();

const subtitles = [
  'Your path to smarter investments starts here',
  'Monitor & optimize portfolios with ease',
  'Engage your clients with transparency'
];

const currentSubtitleIndex = ref(0);

onMounted(() => {
  setInterval(() => {
    currentSubtitleIndex.value = (currentSubtitleIndex.value + 1) % subtitles.length;
  }, 2500);
});

const goToClients = () => {
  router.push('/users');
};
</script>

<style>
.gradient-text {
  display: inline-block;
  font-weight: 800;
  font-size: 3rem;
  background: linear-gradient(270deg, #3a1c71, #d76d77, #ffaf7b);
  background-size: 600% 600%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  animation: gradient-animation 8s ease infinite;
}

@keyframes gradient-animation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
