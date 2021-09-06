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

export { canvasResolutionOptions }
