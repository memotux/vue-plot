import { describe } from 'vitest'
import { testComponent } from './utils';

describe('Plot component renders with props', () => {
  testComponent('PlotWithProps')
})

describe('Plot component renders with children', () => {
  testComponent('PlotWithChildren')
})