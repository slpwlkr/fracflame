import { randomInRange, normalizeArray } from './Helper'

export class Color {
  r: number
  g: number
  b: number

  constructor (random = false, r = 0, g = 0, b = 0) {
    if (random) {
      this.r = randomInRange(true, 0, 255)
      this.g = randomInRange(true, 0, 255)
      this.b = randomInRange(true, 0, 255)
    } else {
      this.r = r
      this.g = g
      this.b = b
    }
  }

  static mix (target: Color, source: Color):void {
    target.r = Math.round((target.r + source.r) / 2)
    target.g = Math.round((target.g + source.g) / 2)
    target.b = Math.round((target.b + source.b) / 2)
  }
}

export class Point {
  x: number
  y: number
  color: Color

  constructor (random = false, x = 0, y = 0, color = new Color(false, 1, 1, 1)) {
    if (random) {
      this.x = randomInRange(false, -1, 1)
      this.y = randomInRange(false, -1, 1)
      this.color = new Color(true)
    } else {
      this.x = x
      this.y = y
      this.color = color
    }
  }
}

export class Attractor {
  affineParams: number[]
  weight: number
  color: Color

  constructor (random = false, affineParams = [1, 0, 0, 0, 1, 0], weight = 1, color = new Color(false, 1, 1, 1)) {
    if (random) {
      this.affineParams = []
      for (let i = 0; i < 6; i++) {
        this.affineParams.push(randomInRange(false, -1, 1))
      }
      this.weight = Math.random()
      this.color = new Color(true)
    } else {
      this.affineParams = affineParams
      this.weight = weight
      this.color = color
    }
  }

  apply (point: Point):void {
    // 仿射变换
    const { x, y } = point
    point.x = this.affineParams[0] * x + this.affineParams[1] * y + this.affineParams[2]
    point.y = this.affineParams[3] * x + this.affineParams[4] * y + this.affineParams[5]

    // 计算颜色
    Color.mix(point.color, this.color)
  }
}

export function generateRandomAttractors (minSize: number, maxSize: number):Attractor[] {
  const size = randomInRange(true, minSize, maxSize)
  const attractors :Attractor[] = []
  for (let i = 0; i < size; i++) {
    attractors.push(new Attractor(true))
  }

  // 归一权重, 默认权重和为1， 精确至小数点后4位
  const oldWeights = attractors.map(i => i.weight)
  const newWeights = normalizeArray(oldWeights, 1, true, -4)
  attractors.forEach((attractor, index) => {
    attractor.weight = newWeights[index]
  })
  return attractors
}
