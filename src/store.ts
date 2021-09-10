import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { Attractor, Point } from '@/utils/FractalFlameAlgorithm'
import { testFlameInEditor, testUser, testHomeCarouselImages, testArtworks } from './testData'

export interface IFlameInEditor {
  artworkID: string
  userID: string
  title: string
  createdAt: number
  lastUpdatedAt: number
  attractors: Attractor[]
  canvasWidth: number
  canvasHeight: number
  gamma: number
  imageData: ImageData
  histogramData: Uint32Array
  drawPoint: Point
  maxFrequency: number
  pointsCalculated: number
  pointsRendered: number
}

export interface IUser {
  userID: string,
  username: string,
  avatar?: string
}

export interface IArtwork {
  artworkID: string,
  userID: string,
  title: string,
  username: string,
  imageURL: string,
  createdAt: number,
  lastUpdatedAt: number,
  canvasWidth: number,
  canvasHeight: number
}
export interface IStoreState {
  isLogin: boolean
  user?: IUser
  flameInEditor?: IFlameInEditor
  homeCarouselImages?: string[]
  artworks?: IArtwork[]
}

export const key: InjectionKey<Store<IStoreState>> = Symbol('key')

export const store = createStore<IStoreState>({
  state: {
    isLogin: true,
    user: testUser,
    flameInEditor: testFlameInEditor,
    homeCarouselImages: testHomeCarouselImages,
    artworks: testArtworks
  },
  mutations: {
    updateFlameInEditor (state, payload: IFlameInEditor) {
      state.flameInEditor = payload
    }
  }
})
