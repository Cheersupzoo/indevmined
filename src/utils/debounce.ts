export function debounce(func: (...args: any) => any, timeout = 100){
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    //@ts-ignore
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}