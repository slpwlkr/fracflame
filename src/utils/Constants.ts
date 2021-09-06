const canvasResolutionOptions = [
  {
    label: '1:1',
    value: '1:1',
    children: [
      {
        label: '320 * 320',
        value: '{"width": 320, "height": 320}'
      },
      {
        label: '480 * 480',
        value: '{"width": 480, "height": 480}'
      },
      {
        label: '512 * 512',
        value: '{"width": 512, "height": 512}'
      },
      {
        label: '640 * 640',
        value: '{"width": 640, "height": 640}'
      },
      {
        label: '800 * 800',
        value: '{"width": 800, "height": 800}'
      },
      {
        label: '1024 * 1024',
        value: '{"width": 1024, "height": 1024}'
      },
      {
        label: '1200 * 1200',
        value: '{"width": 1200, "height": 1200}'
      }
    ]
  },
  {
    label: '4:3',
    value: '4:3',
    children: [
      {
        label: '640 * 480',
        value: '{"width": 640, "height": 480}'
      },
      {
        label: '800 * 600',
        value: '{"width": 800, "height": 600}'
      },
      {
        label: '1024 * 768',
        value: '{"width": 1024, "height": 768}'
      },
      {
        label: '1440 * 1080',
        value: '{"width": 1440, "height": 1080}'
      }
    ]
  },
  {
    label: '16:9',
    value: '16:9',
    children: [
      {
        label: '1024 * 576',
        value: '{"width": 1024, "height": 576}'
      },
      {
        label: '1280 * 720',
        value: '{"width": 1024, "height": 576}'
      },
      {
        label: '1600 * 900',
        value: '{"width": 1600, "height": 900}'
      },
      {
        label: '1920 * 1080',
        value: '{"width": 1920, "height": 1080}'
      }
    ]
  }
]

const variationOptions = [
  {
    label: '线性(linear)',
    value: 0
  },
  {
    label: '正弦(sinusoidal)',
    value: 1
  },
  {
    label: '余弦(cosine)',
    value: 2
  },
  {
    label: '正切(tangent)',
    value: 3
  },
  {
    label: '双曲线(hyperbolic)',
    value: 4
  },
  {
    label: '极坐标(polar)',
    value: 5
  },
  {
    label: '波(waves)',
    value: 6
  },
  {
    label: '自然指数(exponential)',
    value: 7
  },
  {
    label: '极坐标幂(power)',
    value: 8
  },
  {
    label: '射线(rays)',
    value: 9
  },
  {
    label: '割线(secant)',
    value: 10
  },
  {
    label: '球面(spherical)',
    value: 11
  },
  {
    label: '漩涡(swirl)',
    value: 12
  },
  {
    label: '马掌(horseshoe)',
    value: 13
  },
  {
    label: '方巾(handkerchief)',
    value: 14
  },
  {
    label: '心(heart)',
    value: 15
  },
  {
    label: '圆盘(disc)',
    value: 16
  },
  {
    label: '螺旋(spiral)',
    value: 17
  },
  {
    label: '环(ring)',
    value: 18
  },
  {
    label: '钻石(diamond)',
    value: 19
  },
  {
    label: '鱼眼(fisheye)',
    value: 20
  },
  {
    label: '眼鱼(eyefish)',
    value: 21
  },
  {
    label: '爆米花(popcorn)',
    value: 22
  },
  {
    label: '风扇(fan)',
    value: 23
  },
  {
    label: '气泡(bubble)',
    value: 24
  },
  {
    label: '圆柱(cylinder)',
    value: 25
  },
  {
    label: '拱(arch)',
    value: 26
  },
  {
    label: '对角线(ex)',
    value: 27
  },
  {
    label: '十字(cross)',
    value: 28
  },
  {
    label: '刀刃(blade)',
    value: 29
  },
  {
    label: '双三角(twin triangle)',
    value: 30
  },
  {
    label: '朱利亚集(Julia)',
    value: 31
  },
  {
    label: '弯曲(bent)',
    value: 32
  },
  {
    label: '噪音',
    value: 33
  },
  {
    label: '模糊(blur)',
    value: 34
  },
  {
    label: '高斯模糊(Gaussian)',
    value: 35
  },
  {
    label: '方形(square)',
    value: 36
  }
]

export { canvasResolutionOptions, variationOptions }
