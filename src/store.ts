import { InjectionKey } from 'vue'
import { createStore, Store, Commit } from 'vuex'
import { Attractor, Point, Color, VariationFunctions } from '@/utils/FractalFlameAlgorithm'
import { getNewImageData } from '@/utils/Helper'
import { testFlameInEditor, testUser, testHomeCarouselImages, testArtworks } from './testData'
import axios from 'axios'

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
  token: string
  isLogin: boolean
  isInEditor: boolean
  user?: IUser
  flameInEditor?: IFlameInEditor
  homeCarouselImages?: string[]
  artworks?: IArtwork[]
}

export const key: InjectionKey<Store<IStoreState>> = Symbol('key')

export const store = createStore<IStoreState>({
  state: {
    token: localStorage.getItem('token') || '',
    isLogin: false,
    isInEditor: false,
    flameInEditor: testFlameInEditor,
    homeCarouselImages: testHomeCarouselImages,
    artworks: testArtworks
  },
  mutations: {
    updateFlameInEditor (state, payload: IFlameInEditor) {
      state.flameInEditor = payload
    },
    createNewFlameInEditor (state) {
      state.flameInEditor = {
        artworkID: '',
        userID: state.user ? state.user.userID : '',
        title: '新建焰火',
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
        attractors: [
          new Attractor(
            false,
            [0.5, 0, 0, 0, 0.5, -Math.sqrt(3) / 6],
            0.33,
            new Color(false, 255, 0, 0),
            [0],
            VariationFunctions
          ),
          new Attractor(
            false,
            [0.5, 0, 0.25, 0, 0.5, Math.sqrt(3) / 12],
            0.33,
            new Color(false, 0, 255, 0),
            [0],
            VariationFunctions
          ),
          new Attractor(
            false,
            [0.5, 0, -0.25, 0, 0.5, Math.sqrt(3) / 12],
            0.34,
            new Color(false, 0, 0, 255),
            [0],
            VariationFunctions
          )
        ],
        canvasWidth: 640,
        canvasHeight: 640,
        gamma: 2.2,
        imageData: getNewImageData(640, 640),
        histogramData: new Uint32Array(640 * 640 * 4),
        drawPoint: new Point(true),
        maxFrequency: 0,
        pointsCalculated: 0,
        pointsRendered: 0
      }
    },
    setIsInEditor (state, isInEditor: boolean) {
      state.isInEditor = isInEditor
    },
    login (state, rawData) {
      const token = rawData.access_token
      const userid = rawData.userid
      const userName = rawData.username
      const currentUser : IUser = { userID: userid, username: userName }
      state.user = currentUser
      state.token = token
      console.log(`currentUser is ${state.user.username}`)
      localStorage.setItem('token', token)
      console.log(`currentToken is ${state.token}`)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      state.isLogin = true
    },
    fetchCurrentUser (state, rawData) {
      state.user = { ...rawData.data }
    },
    logout (state) {
      state.user = undefined
      state.isLogin = false
      state.token = ''
    }
  },
  actions: {
    fetchCurrentUser ({ commit }, userID) {
      return getAndCommit(`/user/${userID}`, 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/auth/login', 'login', commit, payload)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    register ({ commit }, payload) {
      console.log(payload)
      return axios.post('/auth/register', payload).then((response) => {
        console.log('reg completed')
        console.log(response)
      })
        .catch(function (error) {
          console.log('reg failed')
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
            throw new Error(`${error.response.data.error}`)
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request)
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message)
          }
          console.log(error.config)
        })
    },
    removeAccount ({ commit }, payload) {
      console.log(payload)
      axios.post('auth/delete', payload).then((response) => {
        console.log(response)
      })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
})

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
