export interface Live2DControls {
  destroy: () => void
  tap:     () => void
}
export declare function initLive2D(canvas: HTMLCanvasElement): Promise<Live2DControls>
