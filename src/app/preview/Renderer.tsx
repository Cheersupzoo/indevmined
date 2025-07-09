import { cssToReactStyle } from '@/utils/css'
import { AnyExtension } from '@tiptap/core'
import { DOMOutputSpec, Node } from '@tiptap/pm/model'

export const NodeRenderer = ({
  node,
  nodeExtensionKV,
}: {
  node: Node
  nodeExtensionKV: Record<string, AnyExtension>
}) => {
  if (node.type.name === 'text') {
    if (node.marks.length > 0) {
      let markedText: React.ReactNode = node.text
      node.marks.forEach((mark) => {
        if (!mark.type.spec.toDOM) {
          console.log('missing todom mark', mark.type.name)

          return
        }
        const domSpec = mark.type.spec.toDOM(mark, true)
        if (Array.isArray(domSpec)) {
          const [Tag, attrs] = domSpec
          const { style, class: className, ...restAttrs } = attrs
          markedText = (
            <Tag
              style={style ? cssToReactStyle(style) : undefined}
              className={className}
              {...restAttrs}
            >
              {markedText}
            </Tag>
          )

          return
        }
        console.log('Unhandle mark', mark.type.name)

        return
      })

      return <>{markedText}</>
    }

    return <>{node.text}</>
  }
  const extension = nodeExtensionKV[node.type.name]
  if (extension?.config?.reactNode) {
    const ReactNode = extension.config.reactNode

    return (
      <ReactNode
        node={{
          attrs: { ...node.attrs },
          textContent: node.textContent,
          marks: node.marks,
          content: node.content.toJSON(),
        }}
        editor={null}
      >
        {!node.type.spec.code &&
          node.children.length &&
          node.children.map((node, index) => (
            <NodeRenderer
              key={index}
              node={node}
              nodeExtensionKV={nodeExtensionKV}
            />
          ))}
      </ReactNode>
    )
  }
  if (!node.type.spec.toDOM) {
    console.log('Missing toDom', node.type.name)

    return
  }
  const domSpec = node.type.spec.toDOM(node)

  return (
    <DomRenderer domSpec={domSpec}>
      {node.children.map((node, index) => (
        <NodeRenderer
          key={index}
          node={node}
          nodeExtensionKV={nodeExtensionKV}
        />
      ))}
    </DomRenderer>
  )
}

export const DomRenderer = ({
  domSpec,
  children,
}: {
  domSpec: DOMOutputSpec
  children?: React.ReactNode
}) => {
  // @ts-ignore
  if (domSpec === 0) {
    return <>{children}</>
  }
  if (Array.isArray(domSpec)) {
    let [Tag, ...childrenSpecs] = domSpec
    const isAttrs =
      typeof childrenSpecs[0] === 'object' && !Array.isArray(childrenSpecs[0])
    if (isAttrs) {
      const { style, class: className, ...restAttrs } = childrenSpecs[0]
      childrenSpecs = childrenSpecs.slice(1)
      if (childrenSpecs.length === 0) {
        if (domSpec[0] === 'input') {
          restAttrs.disabled = true
        }

        return (
          <Tag
            style={style ? cssToReactStyle(style) : undefined}
            className={className}
            {...restAttrs}
          />
        )
      }

      return (
        <Tag
          style={style ? cssToReactStyle(style) : undefined}
          className={className}
          {...restAttrs}
        >
          {childrenSpecs.map((childSpec, index) => {
            return (
              <DomRenderer key={index} domSpec={childSpec}>
                {children}
              </DomRenderer>
            )
          })}
        </Tag>
      )
    }

    return (
      <Tag>
        {childrenSpecs.map((childSpec, index) => (
          <DomRenderer key={index} domSpec={childSpec}>
            {children}
          </DomRenderer>
        ))}
      </Tag>
    )
  }

  const Tag = domSpec as string

  return <Tag></Tag>
}
