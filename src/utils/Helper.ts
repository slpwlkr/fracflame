function randomInRange (isInteger: boolean, min: number, max: number, includeMin = true, includeMax = true): number {
  if (isInteger) {
    min = Math.ceil(min) + (includeMin ? 0 : 1)
    max = Math.floor(max) + (includeMax ? 1 : 0)
    return Math.floor(Math.random() * (max - min) + min) // 最小值可以取到，最大值取不到
  } else {
    return Math.random() * (max - min) + min
  }
}

function toPercentageString (num: number): string {
  return (num * 100).toString() + '%'
}

function normalizeArray (array: number[], scale: number, shouldRound: boolean, round = 0): number[] {
  let sum = 0
  const newArray = [...array]
  newArray.forEach((i) => {
    sum += i
  })
  newArray.forEach((i) => {
    i *= scale / sum
  })

  // round 表示四舍五入位数，正为小数点前位数，负为小数点后位数，0为个位四舍五入
  if (shouldRound) {
    const base = Math.pow(10, -round)
    newArray.forEach((i) => {
      i = Math.round(i * base) / base
    })

    // 用最后一项消除误差
    let lastItem = scale
    for (let i = 0; i < newArray.length - 1; i++) {
      lastItem -= newArray[i]
    }
    newArray[newArray.length - 1] = lastItem
  }

  return newArray
}

export { randomInRange, toPercentageString, normalizeArray }
