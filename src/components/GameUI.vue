// src/components/GameUI.vue
<template>
    <!-- <div class="game-ui"> -->
    <div v-if="gameState.isPlaying" class="score-info">Score: {{ gameState.score }} | Level: {{ gameState.level }}</div>

    <div v-if="showMenu" class="ui-overlay">
        <h1>🫧 Bubble Pop</h1>
        <p>Pop groups of 3+ matching colored bubbles!</p>
        <button @click="startGame">Start Game</button>
    </div>

    <div v-if="gameState.isGameOver" class="ui-overlay">
        <h2>Game Over!</h2>
        <p>Final Score: {{ gameState.score }}</p>
        <p>Level Reached: {{ gameState.level }}</p>
        <button @click="restartGame">Play Again</button>
        <button @click="showMainMenu">Main Menu</button>
    </div>

    <div v-if="gameState.isLevelComplete" class="ui-overlay">
        <h2>Level Complete!</h2>
        <p>Moving to Level {{ gameState.level + 1 }}</p>
        <button @click="continueGame">Continue</button>
    </div>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { GameState } from '../types'

interface Props {
    gameState: GameState
    showMenu: boolean
}

interface Emits {
    (e: 'start-game'): void
    (e: 'restart-game'): void
    (e: 'show-menu'): void
    (e: 'next-level'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const startGame = () => emit('start-game')
const restartGame = () => emit('restart-game')
const showMainMenu = () => emit('show-menu')
const continueGame = () => emit('next-level')
</script>

<style scoped>
/* .game-ui {
    position: relative;
    width: 100%;
    height: 100%;
} */

.ui-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 1000;
}

.score-info {
    position: relative;
    color: white;
    font-size: 20px;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 8px;
}

button {
    padding: 12px 24px;
    font-size: 18px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin: 10px 10px 30px 10px;
}

button:hover {
    background: #45a049;
}

h1 {
    margin: 30px;
    /* margin-bottom: 30px; */
    font-size: 48px;
}

h2 {
    margin-bottom: 20px;
}

p {
    margin-bottom: 30px;
}
</style>
