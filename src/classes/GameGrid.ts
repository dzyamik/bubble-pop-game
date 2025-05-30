// src/classes/GameGrid.ts
import { Bubble } from './Bubble'
import { GAME_CONFIG } from '../config/game'

export class GameGrid {
    public grid: (Bubble | null)[][] = []

    constructor(private scene: Phaser.Scene) {}

    init(level: number): void {
        this.clear()
        const { gridHeight, gridWidth, colors } = GAME_CONFIG

        for (let y = 0; y < gridHeight; y++) {
            this.grid[y] = []
            for (let x = 0; x < gridWidth; x++) {
                const colorCount = Math.max(3, 6 - Math.floor(level / 3))
                const color = colors[Math.floor(Math.random() * colorCount)]
                this.grid[y][x] = new Bubble(x, y, color, this.scene).create()
            }
        }
    }

    clear(): void {
        const { gridHeight, gridWidth } = GAME_CONFIG
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if (this.grid[y]?.[x]) {
                    this.grid[y][x]!.destroy()
                    this.grid[y][x] = null
                }
            }
        }
    }

    findConnectedGroup(startX: number, startY: number, color: string, visited = new Set<string>()): Bubble[] {
        const key = `${startX},${startY}`
        if (visited.has(key)) return []

        const bubble = this.grid[startY]?.[startX]
        if (!bubble || bubble.color !== color) return []

        visited.add(key)
        let group = [bubble]

        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]
        for (const [dx, dy] of directions) {
            group = group.concat(this.findConnectedGroup(startX + dx, startY + dy, color, visited))
        }

        return group
    }

    popBubbles(bubbles: Bubble[]): void {
        bubbles.forEach((bubble) => {
            this.createPopEffect(bubble)
            bubble.destroy()
            this.grid[bubble.y][bubble.x] = null
        })
    }

    private createPopEffect(bubble: Bubble): void {
        const { cellSize } = GAME_CONFIG
        const x = bubble.x * cellSize + cellSize / 2
        const y = bubble.y * cellSize + cellSize / 2

        const particles = this.scene.add.particles(x, y, 'white', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.3, end: 0 },
            lifespan: 300,
            quantity: 5,
        })

        this.scene.time.delayedCall(300, () => particles.destroy())
    }

    dropBubbles(): void {
        const { gridWidth, gridHeight } = GAME_CONFIG

        for (let x = 0; x < gridWidth; x++) {
            let writeIndex = gridHeight - 1

            for (let y = gridHeight - 1; y >= 0; y--) {
                if (this.grid[y][x]) {
                    if (y !== writeIndex) {
                        this.grid[writeIndex][x] = this.grid[y][x]
                        this.grid[writeIndex][x]!.y = writeIndex
                        this.grid[writeIndex][x]!.fall()
                        this.grid[y][x] = null
                    }
                    writeIndex--
                }
            }
        }
    }

    countBubbles(): number {
        const { gridHeight, gridWidth } = GAME_CONFIG
        let count = 0
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                if (this.grid[y][x]) count++
            }
        }
        return count
    }
}
