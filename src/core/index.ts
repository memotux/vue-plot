export { default as nodeOps } from './nodeOps'

export const plotCustomElement = {
  template: {
    compilerOptions: {
      isCustomElement: (tag: string) => (tag.startsWith('Plot') && tag !== 'PlotRenderer'),
    },
  },
}