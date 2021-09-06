import { Attractor, Color, Point, VariationFunctions } from '@/utils/FractalFlameAlgorithm'
import { IFlameInEditor } from './store'

const testAttractors1: Attractor[] = [
  new Attractor(
    false,
    [0.5, 0, 0, 0, 0.5, 0],
    0.33,
    new Color(false, 255, 0, 0),
    [0],
    VariationFunctions
  ),
  new Attractor(
    false,
    [0.5, 0, 0, 0, 0.5, 0.5],
    0.33,
    new Color(false, 0, 255, 0),
    [0],
    VariationFunctions
  ),
  new Attractor(
    false,
    [0.5, 0, 0.5, 0, 0.5, 0],
    0.34,
    new Color(false, 0, 0, 255),
    [0],
    VariationFunctions
  )
]

function getTestImageData (width: number, height: number): ImageData {
  const imageData = new ImageData(width, height)
  for (let i = 3; i < width * height; i += 4) {
    imageData.data[i] = 255
  }
  return imageData
}

export const testFlameInEditor: IFlameInEditor = {
  artworkID: '1',
  userID: '1',
  title: 'test flame',
  createdAt: Date.now(),
  lastUpdatedAt: Date.now(),
  attractors: testAttractors1,
  canvasWidth: 800,
  canvasHeight: 600,
  gamma: 2.2,
  imageData: getTestImageData(800, 600),
  histogramData: new Uint32Array(800 * 600 * 4),
  drawPoint: new Point(true),
  maxFrequency: 0,
  pointsCalculated: 0,
  pointsRendered: 0
}
