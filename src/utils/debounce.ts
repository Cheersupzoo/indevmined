export function debounce(func: (...args: any) => any, timeout = 100) {
  let timer: any

  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}
