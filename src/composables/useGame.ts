// src/composables/useGame.ts
import { ref, onMounted, onUnmounted } from 'vue'
import * as Phaser from 'phaser'
import { GameScene } from '../scenes/GameScene'
import { GameState } from '../types'
import { GAME_CONFIG } from '../config/game'

export function useGame() {
    const gameState = ref<GameState>({
        score: 0,
        level: 1,
        targetScore: GAME_CONFIG.baseTargetScore,
        isPlaying: false,
        isGameOver: false,
        isLevelComplete: false,
    })

    const showMenu = ref(true)
    let game: Phaser.Game | null = null
    let gameScene: GameScene | null = null

    const initGame = () => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: GAME_CONFIG.width,
            height: GAME_CONFIG.height,
            parent: 'game-container',
            backgroundColor: '#2c3e50',
            scene: GameScene,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        }

        game = new Phaser.Game(config)

        // Wait for scene to be ready
        game.events.once('ready', () => {
            if (game) {
                gameScene = game.scene.getScene('GameScene') as GameScene

                gameScene.events.on('stateUpdate', (newState: GameState) => {
                    gameState.value = { ...newState }
                })
                gameScene.restart()
            }
        })
    }

    const startGame = () => {
        showMenu.value = false
        gameState.value.isPlaying = true
        if (!game) initGame()
        if (gameScene) gameScene.restart()
    }

    const restartGame = () => {
        gameState.value.isGameOver = false
        if (gameScene) gameScene.restart()
    }

    const showMainMenu = () => {
        gameState.value.isGameOver = false
        gameState.value.isPlaying = false
        showMenu.value = true
    }

    const nextLevel = () => {
        if (gameScene) gameScene.nextLevel()
    }

    onMounted(() => {
        // Game will be initialized when startGame is called
    })

    onUnmounted(() => {
        if (game) {
            game.destroy(true)
            game = null
            gameScene = null
        }
    })

    return {
        gameState,
        showMenu,
        startGame,
        restartGame,
        showMainMenu,
        nextLevel,
    }
}
