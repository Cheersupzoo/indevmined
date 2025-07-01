import { NodeViewProps } from '@tiptap/core'

import { CodeAsync } from './CodeAsync'
import { CodeBlockWrapper } from './CodeBlockWraper'

export const CodeBlockStatic = (props: NodeViewProps) => {
  return (
    <CodeBlockWrapper
      Tag='div'
      CodeRenderer={
        <CodeAsync
          codeblock={{
            value: props.node.textContent ?? '',
            lang: props.node.attrs.language,
            meta: props.node.attrs.language,
          }}
        />
      }
      {...props}
    />
  )
}
