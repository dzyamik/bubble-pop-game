// src/App.vue
<template>
    <!-- <div id="app"> -->
    <div id="game-container">
        <GameUI
            :game-state="gameState"
            :show-menu="showMenu"
            @start-game="startGame"
            @restart-game="restartGame"
            @show-menu="showMainMenu"
            @next-level="nextLevel"
        />
    </div>
    <!-- </div> -->
</template>

<script setup lang="ts">
import GameUI from './components/GameUI.vue'
import { useGame } from './composables/useGame'

const { gameState, showMenu, startGame, restartGame, showMainMenu, nextLevel } = useGame()
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

#app {
    width: 100%;
    max-width: 600px;
    text-align: center;
}

#game-container {
    /* position: relative; */
    display: inline-block;
    border-radius: 10px;
    overflow: hidden;
    /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); */
}
</style>
