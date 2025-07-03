import { NodeViewProps } from '@tiptap/core'

import { CodeAsync } from './CodeAsync'
import { CodeBlockWrapper } from './CodeBlockWraper'

export const CodeBlockStatic = (props: NodeViewProps) => {
  return (
    <CodeBlockWrapper
      Wrapper='div'
      WrapperAttr={{ id: props.node.attrs.id }}
      CodeRenderer={
        <CodeAsync
          codeblock={{
            value: props.node.textContent ?? '',
            lang: props.node.attrs.language,
            meta: props.node.attrs.language,
          }}
          textNode={props.node?.content?.content}
          lineMarks={props.node?.attrs?.lineMark}
        />
      }
      {...props}
    />
  )
}
