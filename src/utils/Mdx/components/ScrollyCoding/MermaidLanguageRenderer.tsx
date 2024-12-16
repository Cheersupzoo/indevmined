import { RawCode } from 'codehike/code'

export const MermaidLanguageRenderer = async ({
  codeblock
}: {
  codeblock: RawCode
}) => {
  const url = new URL('https://mermaid-ssr.vercel.app/render')
  url.searchParams.set('code', codeblock.value)
  const config = {
    theme: 'dark'
  }
  url.searchParams.set('cfg', JSON.stringify(config))
  const response = await fetch(url)
  const result = await response.json()

  const svg = result.svg

  return <div id='output-div' dangerouslySetInnerHTML={{ __html: svg }} />
}
