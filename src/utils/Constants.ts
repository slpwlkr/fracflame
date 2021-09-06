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
      }
    ]
  },
  {
    label: '16:9',
    value: '16:9',
    children: [
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
