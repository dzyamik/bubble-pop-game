// src/classes/Bubble.ts
import * as Phaser from 'phaser'
import { COLOR_HEX, GAME_CONFIG } from '../config/game'

export class Bubble {
    public sprite: Phaser.GameObjects.Arc | null = null
    public marked = false

    constructor(public x: number, public y: number, public color: string, public scene: Phaser.Scene) {}

    create(): this {
        const { cellSize, bubbleSize } = GAME_CONFIG
        this.sprite = this.scene.add.circle(
            this.x * cellSize + cellSize / 2,
            this.y * cellSize + cellSize / 2,
            bubbleSize,
            COLOR_HEX[this.color as keyof typeof COLOR_HEX] || 0xffffff
        )
        this.sprite.setStrokeStyle(2, 0xffffff)
        this.sprite.setInteractive()
        ;(this.sprite as any).bubble = this
        return this
    }

    destroy(): void {
        if (this.sprite) {
            this.sprite.destroy()
            this.sprite = null
        }
    }

    fall(): void {
        if (this.sprite) {
            this.scene.tweens.add({
                targets: this.sprite,
                y: this.y * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
                duration: 200,
                ease: 'Bounce.easeOut',
            })
        }
    }
}
