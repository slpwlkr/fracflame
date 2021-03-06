import { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    baseColor: 'black',
    textColorBase: 'white'
  },
  Layout: {
    siderBorderColor: 'white'
  },
  Divider: {
    color: 'white'
  },
  Button: {
    borderRadiusMedium: '0px',
    border: '1px solid rgb(255, 255, 255)',
    color: 'rgb(32, 32, 32)'
  },
  Collapse: {
    dividerColor: 'white'
  },
  Descriptions: {
    thColor: 'rgb(32, 32, 32)',
    tdColor: 'black',
    borderColor: 'lightgray',
    borderRadius: '0px'
  },
  Typography: {
    headerBarColor: 'white'
  },
  Checkbox: {
    border: '1px solid rgba(255, 255, 255, 0.9)',
    borderRadius: '0px'
  },
  Input: {
    color: 'black',
    colorFocus: 'rgb(32, 32, 32)',
    border: '1px solid rgb(255, 255, 255, 0.9)',
    borderRadius: '0px'
  },
  InternalSelection: {
    border: '1px solid rgb(255, 255, 255, 0.9)',
    borderRadius: '0px',
    color: 'black'
  },
  ColorPicker: {
    border: '1px solid rgb(255, 255, 255, 0.9)',
    borderRadius: '0px'
  }
}

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
    label: '??????(linear)',
    value: 0
  },
  {
    label: '??????(sinusoidal)',
    value: 1
  },
  {
    label: '??????(cosine)',
    value: 2
  },
  {
    label: '??????(tangent)',
    value: 3
  },
  {
    label: '?????????(hyperbolic)',
    value: 4
  },
  {
    label: '?????????(polar)',
    value: 5
  },
  {
    label: '???(waves)',
    value: 6
  },
  {
    label: '????????????(exponential)',
    value: 7
  },
  {
    label: '????????????(power)',
    value: 8
  },
  {
    label: '??????(rays)',
    value: 9
  },
  {
    label: '??????(secant)',
    value: 10
  },
  {
    label: '??????(spherical)',
    value: 11
  },
  {
    label: '??????(swirl)',
    value: 12
  },
  {
    label: '??????(horseshoe)',
    value: 13
  },
  {
    label: '??????(handkerchief)',
    value: 14
  },
  {
    label: '???(heart)',
    value: 15
  },
  {
    label: '??????(disc)',
    value: 16
  },
  {
    label: '??????(spiral)',
    value: 17
  },
  {
    label: '???(ring)',
    value: 18
  },
  {
    label: '??????(diamond)',
    value: 19
  },
  {
    label: '??????(fisheye)',
    value: 20
  },
  {
    label: '??????(eyefish)',
    value: 21
  },
  {
    label: '?????????(popcorn)',
    value: 22
  },
  {
    label: '??????(fan)',
    value: 23
  },
  {
    label: '??????(bubble)',
    value: 24
  },
  {
    label: '??????(cylinder)',
    value: 25
  },
  {
    label: '???(arch)',
    value: 26
  },
  {
    label: '?????????(ex)',
    value: 27
  },
  {
    label: '??????(cross)',
    value: 28
  },
  {
    label: '??????(blade)',
    value: 29
  },
  {
    label: '?????????(twin triangle)',
    value: 30
  },
  {
    label: '????????????(Julia)',
    value: 31
  },
  {
    label: '??????(bent)',
    value: 32
  },
  {
    label: '??????',
    value: 33
  },
  {
    label: '??????(blur)',
    value: 34
  },
  {
    label: '????????????(Gaussian)',
    value: 35
  },
  {
    label: '??????(square)',
    value: 36
  }
]

const sizeLimits = {
  attractorSizeMin: 3,
  attractorSizeMax: 8,
  variationSizeMin: 1,
  variationSizeMax: 6,
  flameTitleLengthMin: 1,
  flameTitleLengthMax: 64
}

export { themeOverrides, canvasResolutionOptions, variationOptions, sizeLimits }
