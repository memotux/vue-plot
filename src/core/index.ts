export { getPlotApp } from './context'

export const plotCustomElement = {
  template: {
    compilerOptions: {
      isCustomElement: (tag: string) => (tag.startsWith('Plot')),
    },
  },
}