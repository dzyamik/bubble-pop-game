// src/scenes/GameScene.ts
import * as Phaser from 'phaser'
import { GameGrid } from '../classes/GameGrid'
import { Bubble } from '../classes/Bubble'
import { GAME_CONFIG } from '../config/game'
import { GameState } from '../types'

export class GameScene extends Phaser.Scene {
    private gameGrid!: GameGrid
    private gameState: GameState = {
        score: 0,
        level: 1,
        targetScore: GAME_CONFIG.baseTargetScore,
        isPlaying: false,
        isGameOver: false,
        isLevelComplete: false,
    }

    constructor() {
        super({ key: 'GameScene' })
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#2c3e50')
        this.add.graphics().fillStyle(0xffffff).fillRect(0, 0, 4, 4).generateTexture('white', 4, 4)

        this.gameGrid = new GameGrid(this)
        this.gameGrid.init(this.gameState.level)

        this.input.on('gameobjectdown', this.onBubbleClick, this)
    }

    // _ is for unused pointer parameter
    private onBubbleClick(_: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject): void {
        const bubble = (gameObject as any).bubble as Bubble
        if (!bubble) return

        const group = this.gameGrid.findConnectedGroup(bubble.x, bubble.y, bubble.color)

        if (group.length >= 3) {
            this.gameGrid.popBubbles(group)
            this.updateScore(group.length)
            this.gameGrid.dropBubbles()
            this.checkWinCondition()
        }
    }

    private updateScore(bubbleCount: number): void {
        const baseScore = bubbleCount * 10
        const multiplier = Math.max(1, bubbleCount - 2)
        this.gameState.score += baseScore * multiplier * this.gameState.level
        this.emitStateUpdate()
    }

    private checkWinCondition(): void {
        if (this.gameState.score >= this.gameState.targetScore || this.gameGrid.countBubbles() === 0) {
            this.gameState.isLevelComplete = true
            this.emitStateUpdate()
        }
    }

    public nextLevel(): void {
        this.gameState.level++
        this.gameState.targetScore += GAME_CONFIG.scoreIncrement * this.gameState.level
        this.gameState.isLevelComplete = false
        this.gameGrid.init(this.gameState.level)
        this.emitStateUpdate()
    }

    public restart(): void {
        this.gameState = {
            score: 0,
            level: 1,
            targetScore: GAME_CONFIG.baseTargetScore,
            isPlaying: true,
            isGameOver: false,
            isLevelComplete: false,
        }
        this.gameGrid.init(this.gameState.level)
        this.emitStateUpdate()
    }

    public getState(): GameState {
        return { ...this.gameState }
    }

    private emitStateUpdate(): void {
        this.events.emit('stateUpdate', this.gameState)
    }
}
