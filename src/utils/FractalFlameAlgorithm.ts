import { randomInRange, toPercentageString, normalizeArray } from './helper'

class Color {
  r: number
  g: number
  b: number

  constructor (random = false, r = 0, g = 0, b = 0) {
    if (random) {
      this.r = Math.random()
      this.g = Math.random()
      this.b = Math.random()
    } else {
      this.r = r
      this.g = g
      this.b = b
    }
  }

  get CSSString () {
    return `rgb(${toPercentageString(this.r)},${toPercentageString(this.g)},${toPercentageString(this.b)})`
  }

  static mix (colorA: Color, colorB: Color): Color {
    const color = new Color(false)
    color.r = (colorA.r + colorB.r) / 2
    color.g = (colorA.g + colorB.g) / 2
    color.b = (colorA.b + colorB.b) / 2
    return color
  }
}

class Point {
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
      this.affineParams = new Array<number>(6)
      this.affineParams.forEach((param) => {
        param = randomInRange(false, -1, 1)
      })
      this.weight = Math.random()
      this.color = new Color(true)
    } else {
      this.affineParams = affineParams
      this.weight = weight
      this.color = color
    }
  }

  apply (point: Point): Point {
    // 仿射变换
    const affinePoint = new Point()
    affinePoint.x = this.affineParams[0] * point.x + this.affineParams[1] * point.y + this.affineParams[2]
    affinePoint.y = this.affineParams[3] * point.x + this.affineParams[4] * point.y + this.affineParams[5]

    // 计算颜色
    affinePoint.color = Color.mix(point.color, this.color)

    return affinePoint
  }
}

export function generateRandomAttractors (minSize: number, maxSize: number):Attractor[] {
  const size = randomInRange(true, minSize, maxSize)

  const attractors = new Array<Attractor>(size)
  attractors.forEach((i) => {
    i = new Attractor(true)
  })

  // 归一权重, 默认权重和为1， 精确至小数点后4位
  const oldWeights = attractors.map(i => i.weight)
  const newWeights = normalizeArray(oldWeights, 1, true, -4)
  attractors.forEach((attractor, index) => {
    attractor.weight = newWeights[index]
  })

  return attractors
}
