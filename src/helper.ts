function RandomInRange (isInteger: boolean, min: number, max: number, includeMin = true, includeMax = true): number {
  if (isInteger) {
    min = Math.ceil(min) + (includeMin ? 0 : 1)
    max = Math.floor(max) + (includeMax ? 1 : 0)
    return Math.floor(Math.random() * (max - min) + min) // 最小值可以取到，最大值取不到
  } else {
    return Math.random() * (max - min) + min
  }
}

export { RandomInRange }
