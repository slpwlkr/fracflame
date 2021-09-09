import { randomInRange, normalizeArray, toFixedNumber, randomPermutation } from './Helper'

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

  static mix (target: Color, source: Color): void {
    target.r = Math.round((target.r + source.r) / 2)
    target.g = Math.round((target.g + source.g) / 2)
    target.b = Math.round((target.b + source.b) / 2)
  }

  // 将rgb(1, 1, 1)模式的字符串匹配为对应对象，失败返回默认值
  static parseString (value: string): Color {
    const regex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/g
    const result = regex.exec(value)
    if (result) {
      return new Color(false, parseInt(result[1]), parseInt(result[2]), parseInt(result[3]))
    } else {
      return new Color()
    }
  }

  static toString (color: Color): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
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

interface IVariationFunctionParams {
  x: number
  y: number
  affineParams?: number[]
  weight?: number
}
interface IVariationFunction {
  name: string
  func: (params: IVariationFunctionParams) => [x: number, y: number]
}

class VariationHelper {
  static radius (x: number, y: number): number {
    return Math.sqrt(x * x + y * y)
  }

  static radiusSquare (x: number, y: number): number {
    return x * x + y * y
  }

  static theta (x: number, y: number): number {
    return Math.atan2(x, y)
  }

  static phi (x: number, y: number): number {
    return Math.atan2(y, x)
  }

  static omega (): number {
    return Math.random() > 0.5 ? 0 : Math.PI
  }

  static psi (): number {
    return Math.random()
  }
}

export const VariationFunctions: IVariationFunction[] = [
  // 0.线性
  {
    name: 'linear',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      return [params.x, params.y]
    }
  },
  // 1.正弦
  {
    name: 'sinusoidal',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      return [Math.sin(params.x), Math.sin(params.y)]
    }
  },
  // 2.余弦
  {
    name: 'cosine',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      return [Math.cos(Math.PI * x) * Math.cosh(y), -Math.sin(Math.PI * x) * Math.sinh(y)]
    }
  },
  // 3.正切
  {
    name: 'tangent',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      return [Math.sin(x) / Math.cos(y), Math.tan(y)]
    }
  },
  // 4.双曲线
  {
    name: 'hyperbolic',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      return [Math.sin(VariationHelper.theta(x, y)) / VariationHelper.radius(x, y), VariationHelper.radius(x, y) * Math.cos(VariationHelper.theta(x, y))]
    }
  },
  // 5.极坐标
  {
    name: 'polar',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      return [VariationHelper.theta(x, y) / Math.PI, VariationHelper.radius(x, y) - 1]
    }
  },
  // 6.波
  {
    name: 'waves',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, affineParams } = params
      if (affineParams) {
        const b = affineParams[1]
        const c = affineParams[2]
        const e = affineParams[4]
        const f = affineParams[5]

        return [x + b * Math.sin(y / (c * c)), y + e * Math.sin(x / (f * f))]
      } else {
        return [x, y]
      }
    }
  },
  // 7.自然指数
  {
    name: 'exponential',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      return [Math.exp(x - 1) * Math.cos(Math.PI * y), Math.exp(x - 1) * Math.sin(Math.PI * y)]
    }
  },
  // 8.极坐标幂
  {
    name: 'power',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.theta(x, y)
      const m2 = Math.sin(m1)
      const m3 = Math.pow(VariationHelper.radius(x, y), m2)
      return [m3 * Math.cos(m1), m3 * m2]
    }
  },
  // 9.射线
  {
    name: 'rays',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, weight } = params
      if (weight) {
        const m1 = weight * Math.tan(VariationHelper.psi() * Math.PI * weight) / VariationHelper.radiusSquare(x, y)
        return [m1 * Math.cos(x), m1 * Math.sin(y)]
      } else {
        return [x, y]
      }
    }
  },
  // 10.割线
  {
    name: 'secant',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, weight } = params
      if (weight) {
        return [x, 1 / (weight * Math.cos(weight * VariationHelper.radius(x, y)))]
      } else {
        return [x, y]
      }
    }
  },
  // 11.球面
  {
    name: 'spherical',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = 1 / VariationHelper.radiusSquare(x, y)
      return [m1 * x, m1 * y]
    }
  },
  // 12.漩涡
  {
    name: 'swirl',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.radiusSquare(x, y)
      const m2 = Math.sin(m1)
      const m3 = Math.cos(m1)
      return [x * m2 - y * m3, x * m3 + y * m2]
    }
  },
  // 13.马掌
  {
    name: 'horseshoe',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = 1 / VariationHelper.radius(x, y)
      return [m1 * (x - y) * (x + y), m1 * 2 * x * y]
    }
  },
  // 14.方巾
  {
    name: 'handkerchief',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.radius(x, y)
      const m2 = VariationHelper.theta(x, y)
      return [m1 * Math.sin(m2 + m1), m1 * Math.cos(m2 - m1)]
    }
  },
  // 15.心
  {
    name: 'heart',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.radius(x, y)
      const m2 = VariationHelper.theta(x, y)
      return [m1 * Math.sin(m2 * m1), -m1 * Math.cos(m2 * m1)]
    }
  },
  // 16.圆盘
  {
    name: 'disc',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.theta(x, y) / Math.PI
      const m2 = VariationHelper.radius(x, y) * Math.PI
      return [m1 * Math.sin(m2), m1 * Math.cos(m2)]
    }
  },
  // 17.螺旋
  {
    name: 'spiral',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.radius(x, y)
      const m2 = VariationHelper.theta(x, y)
      return [1 / m1 * (Math.cos(m2) + Math.sin(m1)), 1 / m1 * (Math.sin(m2) - Math.cos(m1))]
    }
  },
  // 18.环
  {
    name: 'ring',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, affineParams } = params
      if (affineParams) {
        const m1 = VariationHelper.radius(x, y)
        const m2 = VariationHelper.theta(x, y)
        const m3 = affineParams[2] * affineParams[2]
        const m4 = ((m1 + m3) % (2 * m3)) - m3 + m1 * (1 - m3)

        return [m4 * Math.cos(m2), m4 * Math.sin(m2)]
      } else {
        return [x, y]
      }
    }
  },
  // 19.钻石
  {
    name: 'diamond',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.radius(x, y)
      const m2 = VariationHelper.theta(x, y)
      return [Math.cos(m1) * Math.sin(m2), Math.cos(m2) * Math.sin(m1)]
    }
  },
  // 20.鱼眼
  {
    name: 'fisheye',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = 2 / (VariationHelper.radius(x, y) + 1)
      return [m1 * y, m1 * x]
    }
  },
  // 21.眼鱼
  {
    name: 'eyefish',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = 2 / (VariationHelper.radius(x, y) + 1)
      return [m1 * x, m1 * y]
    }
  },
  // 22.爆米花
  {
    name: 'popcorn',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, affineParams } = params
      if (affineParams) {
        const c = affineParams[2]
        const f = affineParams[5]
        return [x + c * Math.sin(Math.tan(3 * y)), y + f * Math.sin(Math.tan(3 * x))]
      } else {
        return [x, y]
      }
    }
  },
  // 23.风扇
  {
    name: 'fan',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, affineParams } = params
      if (affineParams) {
        const t = Math.PI * affineParams[2] * affineParams[2]
        const f = affineParams[5]
        const m1 = VariationHelper.radius(x, y)
        const m2 = VariationHelper.theta(x, y)
        if ((m2 + f) % t > t / 2) {
          return [m1 * Math.cos(m2 - t / 2), m1 * Math.sin(m2 - t / 2)]
        } else {
          return [m1 * Math.cos(m2 + t / 2), m1 * Math.sin(m2 + t / 2)]
        }
      } else {
        return [x, y]
      }
    }
  },
  // 24.气泡
  {
    name: 'bubble',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = 4 / (VariationHelper.radiusSquare(x, y) + 4)
      return [m1 * x, m1 * y]
    }
  },
  // 25.圆柱
  {
    name: 'cylinder',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      return [Math.sin(x), y]
    }
  },
  // 26.拱
  {
    name: 'arch',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, weight } = params
      if (weight) {
        const m1 = VariationHelper.psi() * Math.PI * weight
        return [Math.sin(m1), Math.sin(m1) * Math.sin(m1) / Math.cos(m1)]
      } else {
        return [x, y]
      }
    }
  },
  // 27.对角线
  {
    name: 'ex',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = VariationHelper.radius(x, y)
      const m2 = VariationHelper.theta(x, y)
      const p0 = Math.sin(m2 + m1)
      const p1 = Math.cos(m2 - m1)
      const p2 = p0 * p0 * p0
      const p3 = p1 * p1 * p1
      return [m1 * (p2 + p3), m1 * (p2 - p3)]
    }
  },
  // 28.十字
  {
    name: 'cross',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = Math.abs(1 / (x * x - y * y))
      return [m1 * x, m1 * y]
    }
  },
  // 29.刀刃
  {
    name: 'blade',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, weight } = params
      if (weight) {
        const m1 = VariationHelper.psi() * VariationHelper.radius(x, y) * weight
        const m2 = Math.cos(m1)
        const m3 = Math.sin(m1)
        return [x * (m2 + m3), x * (m2 - m3)]
      } else {
        return [x, y]
      }
    }
  },
  // 30.双三角
  {
    name: 'twinTriangle',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y, weight } = params
      if (weight) {
        const m1 = VariationHelper.psi() * VariationHelper.radius(x, y) * weight
        const m2 = Math.sin(m1)
        const m3 = Math.cos(m1)
        const t = Math.log10(m2 * m2) + m3
        return [x * t, x * (t - Math.PI * m2)]
      } else {
        return [x, y]
      }
    }
  },
  // 31.朱利亚集
  {
    name: 'julia',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = Math.sqrt(VariationHelper.radius(x, y))
      const m2 = VariationHelper.theta(x, y) / 2 + VariationHelper.omega()
      return [m1 * Math.cos(m2), m1 * Math.sin(m2)]
    }
  },
  // 32.弯曲
  {
    name: 'bent',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      if (x >= 0) {
        if (y >= 0) {
          return [x, y]
        } else {
          return [x, y / 2]
        }
      } else {
        if (y >= 0) {
          return [2 * x, y]
        } else {
          return [2 * x, y / 2]
        }
      }
    }
  },
  // 33.噪音
  {
    name: 'noise',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const psi1 = VariationHelper.psi()
      const psi2 = 2 * Math.PI * VariationHelper.psi()
      return [psi1 * x * Math.cos(psi2), psi1 * y * Math.sin(psi2)]
    }
  },
  // 34.模糊
  {
    name: 'blur',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = x + y // 改params为可选参数很麻烦，这里绕一下
      const psi1 = VariationHelper.psi()
      const psi2 = 2 * Math.PI * VariationHelper.psi()
      return [psi1 * Math.cos(psi2) + m1 - m1, psi1 * Math.sin(psi2)]
    }
  },
  // 35.高斯模糊
  {
    name: 'gaussian',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = x + y // 改params为可选参数很麻烦，这里绕一下
      let psi1 = -2
      for (let i = 0; i < 4; i++) {
        psi1 += VariationHelper.psi()
      }
      const psi2 = 2 * Math.PI * VariationHelper.psi()

      return [psi1 * Math.cos(psi2) + m1 - m1, psi1 * Math.sin(psi2)]
    }
  },
  // 36.方形
  {
    name: 'square',
    func: (params: IVariationFunctionParams): [x: number, y: number] => {
      const { x, y } = params
      const m1 = x + y // 改params为可选参数很麻烦，这里绕一下
      return [VariationHelper.psi() - 0.5 + m1 - m1, VariationHelper.psi() - 0.5]
    }
  }
]
export class Variation {
  typeIndex: number
  weight: number
  functionInfo: IVariationFunction

  constructor (typeIndex: number, weight: number, functionInfo: IVariationFunction) {
    this.typeIndex = typeIndex
    this.weight = weight
    this.functionInfo = functionInfo
  }
}

export class Attractor {
  affineParams: number[]
  weight: number
  color: Color
  variations: Variation[]

  constructor (
    random = false,
    affineParams = [1, 0, 0, 0, 1, 0],
    weight = 1, color = new Color(false, 0, 0, 0),
    chosenVariations: number[] = [0],
    variationFunctions: IVariationFunction[] = [
      {
        name: 'linear',
        func: (params: IVariationFunctionParams): [x: number, y: number] => {
          return [params.x, params.y]
        }
      }
    ]
  ) {
    if (random) {
      this.affineParams = []
      for (let i = 0; i < 6; i++) {
        this.affineParams.push(toFixedNumber(randomInRange(false, -1, 1), 4))
      }
      this.weight = toFixedNumber(Math.random(), 4)
      this.color = new Color(true)

      // 从给定范围中随机选若干个不重复的变体子
      this.variations = []
      const variationSize = randomInRange(true, 1, chosenVariations.length)
      const localChosenVariations = randomPermutation(chosenVariations.length).slice(0, variationSize)
      // 初始化一组权重
      let variationWeights:number[] = []
      for (let i = 0; i < variationSize; i++) {
        variationWeights[i] = Math.random()
      }
      variationWeights = [...normalizeArray(variationWeights, 1, true, 4)]
      for (let i = 0; i < variationSize; i++) {
        const chosenIndex = chosenVariations[localChosenVariations[i]]
        this.variations[i] = new Variation(chosenIndex, variationWeights[i], variationFunctions[chosenIndex])
      }
    } else {
      this.affineParams = affineParams
      this.weight = weight
      this.color = color
      this.variations = []
      // 默认为1个线性变体子
      this.variations[0] = new Variation(0, 1, variationFunctions[0])
    }
  }

  // 由于每次绘制都调用，出于性能考虑直接更改传进来的参数
  apply (point: Point):void {
    // 仿射变换
    const { x: x0, y: y0 } = point
    const x1 = this.affineParams[0] * x0 + this.affineParams[1] * y0 + this.affineParams[2]
    const y1 = this.affineParams[3] * x0 + this.affineParams[4] * y0 + this.affineParams[5]

    // 应用变体子
    let x2 = 0
    let y2 = 0
    for (let i = 0; i < this.variations.length; i++) {
      const [xi, yi] = this.variations[i].functionInfo.func({
        x: x1,
        y: y1,
        affineParams: this.affineParams,
        weight: this.weight
      })
      const weight = this.variations[i].weight
      x2 += xi * weight
      y2 += yi * weight
    }
    point.x = x2
    point.y = y2
    // 计算颜色
    Color.mix(point.color, this.color)
  }
}

export function generateRandomChosenVariations (
  minSize: number,
  maxSize: number,
  variationFunctions: IVariationFunction[]
):number[] {
  const size = randomInRange(true, minSize, maxSize)
  return randomPermutation(variationFunctions.length).slice(0, size)
}

export function generateRandomAttractors (
  minSize: number,
  maxSize: number,
  chosenVariations: number[], // 变体子范围由用户指定或随机生成
  variationFunctions: IVariationFunction[]
): Attractor[] {
  const size = randomInRange(true, minSize, maxSize)
  const attractors :Attractor[] = []
  for (let i = 0; i < size; i++) {
    attractors.push(new Attractor(true, [], 0, new Color(), chosenVariations, variationFunctions))
  }

  // 归一权重, 默认权重和为1， 精确至小数点后4位
  const oldWeights = attractors.map(i => i.weight)
  const newWeights = normalizeArray(oldWeights, 1, true, 4)
  attractors.forEach((attractor, index) => {
    attractor.weight = newWeights[index]
  })
  return attractors
}
