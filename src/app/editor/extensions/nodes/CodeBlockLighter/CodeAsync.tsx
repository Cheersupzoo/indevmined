import { renderCode } from '@/utils/Mdx/components/ScrollyCoding/Code'
import { RawCode } from 'codehike/code'

export const CodeAsync = async ({
  codeblock,
  noWrap,
}: {
  codeblock: RawCode
  noWrap?: boolean
}) => {
  const { code } = await renderCode({ codeblock, noWrap })

  return code
}
