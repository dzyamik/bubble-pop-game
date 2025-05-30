// src/types/index.ts
export interface BubbleData {
    x: number
    y: number
    color: string
}

export interface GameState {
    score: number
    level: number
    targetScore: number
    isPlaying: boolean
    isGameOver: boolean
    isLevelComplete: boolean
}
