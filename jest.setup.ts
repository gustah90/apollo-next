import '@testing-library/jest-dom'

import { TextEncoder, TextDecoder } from 'util'
;(global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder
;(global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder =
  TextDecoder as unknown as typeof TextDecoder

import React from 'react'
import type { ImgHTMLAttributes } from 'react'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => React.createElement('img', props),
}))
