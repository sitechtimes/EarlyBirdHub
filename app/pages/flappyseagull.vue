<template>
  <div
    @click="flap"
    class="relative w-full max-w-md h-[600px] bg-sky-400 overflow-hidden mx-auto mt-8 rounded-lg select-none cursor-pointer"
  >
    <!-- Ground -->
    <div class="absolute bottom-0 w-full h-24 bg-yellow-400"></div>

    <!-- Bird (Seagull) -->
    <img
      ref="birdRef"
      :style="birdStyle"
      src="https://t4.ftcdn.net/jpg/05/62/11/69/240_F_562116937_6HlxiUIl4Q9W5PcGvu9d8jsiK9ZHUT02.jpg"
      alt="Seagull"
      class="absolute w-12 h-12 rounded-full"
      draggable="false"
    />

    <!-- Pipes -->
    <div v-for="(pipe, index) in pipes" :key="index">
      <!-- Top pipe -->
      <div
        class="absolute bg-green-700 rounded-t-xl"
        :style="{
          width: pipeWidth + 'px',
          height: pipe.topHeight + 'px',
          left: pipe.x + 'px',
          top: '0px',
        }"
      ></div>

      <!-- Bottom pipe -->
      <div
        class="absolute bg-green-700 rounded-b-xl"
        :style="{
          width: pipeWidth + 'px',
          height: pipe.bottomHeight + 'px',
          left: pipe.x + 'px',
          bottom: '24px',
        }"
      ></div>
    </div>

    <!-- Score -->
    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-3xl select-none">
      {{ score }}
    </div>

    <!-- Game Over Overlay -->
    <div
      v-if="gameOver"
      class="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white space-y-4"
    >
      <h2 class="text-4xl font-bold">Game Over</h2>
      <p class="text-xl">Score: {{ score }}</p>
      <button
        @click.stop="resetGame"
        class="bg-yellow-400 text-black font-bold px-6 py-2 rounded hover:bg-yellow-300"
      >
        Play Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

const gameWidth = 400
const gameHeight = 600
const gravity = 0.5
const flapStrength = -10
const pipeGap = 150
const pipeWidth = 60
const pipeSpeed = 2

const bird = reactive({
  x: 80,
  y: gameHeight / 2,
  velocity: 0,
  width: 48,
  height: 48,
})

const pipes = ref([])
const frame = ref(0)
const score = ref(0)
const gameOver = ref(false)
let animationFrameId = null

const birdRef = ref(null)

function flap() {
  if (gameOver.value) return
  bird.velocity = flapStrength
}

function resetGame() {
  bird.y = gameHeight / 2
  bird.velocity = 0
  pipes.value = []
  frame.value = 0
  score.value = 0
  gameOver.value = false
  loop()
}

function loop() {
  animationFrameId = requestAnimationFrame(loop)

  if (gameOver.value) {
    cancelAnimationFrame(animationFrameId)
    return
  }

  frame.value++

  // Bird physics
  bird.velocity += gravity
  bird.y += bird.velocity

  // Bird boundary - ground and top
  if (bird.y + bird.height > gameHeight - 24) {
    bird.y = gameHeight - 24 - bird.height
    gameOver.value = true
  }
  if (bird.y < 0) {
    bird.y = 0
    bird.velocity = 0
  }

  // Pipes management
  if (frame.value % 90 === 0) {
    // Random top pipe height (between 50 and max available)
    const maxTopHeight = gameHeight - pipeGap - 24 - 50
    const topHeight = Math.floor(Math.random() * maxTopHeight) + 50

    pipes.value.push({
      x: gameWidth,
      topHeight,
      bottomHeight: gameHeight - pipeGap - topHeight - 24,
      passed: false,
    })
  }

  // Move pipes and check collisions
  pipes.value.forEach((pipe) => {
    pipe.x -= pipeSpeed

    // Score check
    if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
      score.value++
      pipe.passed = true
    }

    // Collision detection
    const birdRect = {
      left: bird.x,
      right: bird.x + bird.width,
      top: bird.y,
      bottom: bird.y + bird.height,
    }

    const topPipeRect = {
      left: pipe.x,
      right: pipe.x + pipeWidth,
      top: 0,
      bottom: pipe.topHeight,
    }

    const bottomPipeRect = {
      left: pipe.x,
      right: pipe.x + pipeWidth,
      top: gameHeight - pipe.bottomHeight - 24,
      bottom: gameHeight - 24,
    }

    function intersects(r1, r2) {
      return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
      )
    }

    if (intersects(birdRect, topPipeRect) || intersects(birdRect, bottomPipeRect)) {
      gameOver.value = true
    }
  })

  // Remove off-screen pipes
  pipes.value = pipes.value.filter((pipe) => pipe.x + pipeWidth > 0)
}

const birdStyle = computed(() => ({
  left: bird.x + 'px',
  top: bird.y + 'px',
  transform: `rotate(${bird.velocity * 3}deg)`,
}))

onMounted(() => {
  resetGame()
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      flap()
    }
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
img {
  user-select: none;
  -webkit-user-drag: none;
}
</style>
