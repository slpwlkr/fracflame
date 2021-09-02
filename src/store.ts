import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { Attractor, Point } from '@/utils/FractalFlameAlgorithm'
import { testFlameInEditor } from './testData'

export interface IFlameInEditor {
  artworkID: string
  userID: string
  title: string
  createdAt: number
  lastUpdatedAt: number
  attractors: Attractor[]
  canvasWidth: number
  canvasHeight: number
  imageData: ImageData
  histogramData: Uint32Array
  drawPoint: Point
  maxFrequency: number
  pointsCalculated: number
  pointsRendered: number
}

export interface IStoreState {
  flameInEditor?: IFlameInEditor
}

export const key: InjectionKey<Store<IStoreState>> = Symbol('key')

export const store = createStore<IStoreState>({
  state: {
    flameInEditor: testFlameInEditor
  },
  mutations: {
    updateFlameInEditor (state, payload: IFlameInEditor) {
      state.flameInEditor = payload
    }
  }
})
