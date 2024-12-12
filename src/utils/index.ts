// https://github.com/Tresjs/tres/blob/main/src/utils/index.ts#L37

const HTML_TAGS
  = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,'
  + 'header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,'
  + 'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,'
  + 'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,'
  + 'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,'
  + 'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,'
  + 'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,'
  + 'option,output,progress,select,textarea,details,dialog,menu,'
  + 'summary,template,blockquote,iframe,tfoot'

export const isHTMLTag = /* #__PURE__ */ makeMap(HTML_TAGS)

function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => boolean {
  const map: Record<string, boolean> = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}

export function kebabToCamel(str: string) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export function noop(fn: string): any {
  // eslint-disable-next-line ts/no-unused-expressions
  fn
}

export * as is from './is'