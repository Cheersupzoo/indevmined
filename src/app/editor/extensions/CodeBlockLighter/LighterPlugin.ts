import { findChildren } from '@tiptap/core'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view'
import { highlightSync, preload } from '@code-hike/lighter'
import type { CSSProperties } from 'react'

function styleJSToCSS(JS: CSSProperties) {
  let cssString = ''
  for (let objectKey in JS) {
    cssString +=
      objectKey.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`) +
      ': ' +
      JS[objectKey as keyof CSSProperties] +
      ';\n'
  }

  return cssString
}

function parseNodes(
  nodes: any[],
  className: string[] = []
): { text: string; classes: string[] }[] {
  return nodes
    .map((node) => {
      const classes = [
        ...className,
        ...(node.properties ? node.properties.className : [])
      ]

      if (node.children) {
        return parseNodes(node.children, classes)
      }

      return {
        text: node.value,
        classes
      }
    })
    .flat()
}

// function getHighlightNodes(result: any) {
//   // `.value` for lowlight v1, `.children` for lowlight v2
//   return result.value || result.children || []
// }

// function registered(aliasOrLanguage: string) {
//   return Boolean(highlight.getLanguage(aliasOrLanguage))
// }

let loading = true
const loadedLanguage = new Set<string>()
const loadingLanguage = new Set<string>()
let reloadView: (() => void) | null = null
let forceRerender = false

function getDecorations({
  doc,
  name,
  defaultLanguage,
  editor
}: {
  doc: ProsemirrorNode
  name: string
  defaultLanguage: string | null | undefined
  editor: EditorView
}) {
  const decorations: Decoration[] = []
  findChildren(doc, (node) => node.type.name === name).forEach((block) => {
    let from = block.pos + 1
    const language = block.node.attrs.language || defaultLanguage

    if (loadingLanguage.has(language)) {
      return
    }
    if (!loadedLanguage.has(language)) {
      ;(async () => {
        loadingLanguage.add(language)
        await preload([language])
        loadingLanguage.delete(language)
        loadedLanguage.add(language)
        forceRerender = true
        reloadView?.()
      })()

      return
    }

    const nodes = highlightSync(block.node.textContent, language, 'dark-plus')

    const lineNumberWidth = nodes.lines.length.toString().length + 2

    // flatten lines into nodes as we don't need in this
    nodes.lines.forEach((line, index) => {
      const bgHighlighterDec = Decoration.widget(
        from,
        () => {
          const lineHighlight = document.createElement('div')
          const lineMarkSet = new Set(block.node.attrs?.lineMark)
          if (lineMarkSet.has(index + 1)) {
            lineHighlight.style.cssText = `background-color: rgb(from ${'gold'} r g b / 0.13); border-left-color: ${'gold'}`
          }
          lineHighlight.innerHTML = `&nbsp;`
          lineHighlight.className = 'line-highlighter'

          return lineHighlight
        },
        { side: -1 }
      )
      decorations.push(bgHighlighterDec)
      // add line number
      const lineNumberDec = Decoration.widget(
        from,
        () => {
          const lineNum = document.createElement('div')
          lineNum.style.cssText = `min-width: ${lineNumberWidth}ch; `
          lineNum.className = 'line-number'
          lineNum.innerHTML = `${index + 1}`
          lineNum.addEventListener('click', () => {
            const updatedLineMark = [...block.node.attrs?.lineMark]
            const indexArray = updatedLineMark.indexOf(index + 1)
            if (indexArray !== -1) {
              updatedLineMark.splice(indexArray, 1)
            } else {
              updatedLineMark.push(index + 1)
            }

            editor.dispatch(
              editor.state.tr.setNodeAttribute(
                block.pos,
                'lineMark',
                updatedLineMark
              )
            )
          })

          return lineNum
        },
        { side: -1 }
      )
      decorations.push(lineNumberDec)
      // apply syntax highlighter
      line.forEach((node) => {
        const to = from + node.content.length
        if (Object.keys(node.style).length) {
          const decoration = Decoration.inline(from, to, {
            style: styleJSToCSS(node.style) + 'display: inline-block;'
          })

          decorations.push(decoration)
        }

        from = to
      })
      from++ // new line consume 1 pointer
    })
  })

  return DecorationSet.create(doc, decorations)
}

function isFunction(param: any): param is Function {
  return typeof param === 'function'
}

export function LighterPlugin({
  name,
  defaultLanguage
}: {
  name: string
  defaultLanguage: string | null | undefined
}) {
  let editor: EditorView
  const lighterPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('lighter'),

    state: {
      init: (_, { doc }) =>
        getDecorations({ doc, name, defaultLanguage, editor }),
      apply: (transaction, decorationSet, oldState, newState) => {
        if (loading) {
          return DecorationSet.empty
        }
        const oldNodeName = oldState.selection.$head.parent.type.name
        const newNodeName = newState.selection.$head.parent.type.name
        const oldNodes = findChildren(
          oldState.doc,
          (node) => node.type.name === name
        )
        const newNodes = findChildren(
          newState.doc,
          (node) => node.type.name === name
        )

        if (
          forceRerender ||
          (transaction.docChanged &&
            // Apply decorations if:
            // selection includes named node,
            ([oldNodeName, newNodeName].includes(name) ||
              // OR transaction adds/removes named node,
              newNodes.length !== oldNodes.length ||
              // OR transaction has changes that completely encapsulte a node
              // (for example, a transaction that affects the entire document).
              // Such transactions can happen during collab syncing via y-prosemirror, for example.
              transaction.steps.some((step) => {
                if (
                  // @ts-ignore
                  step.attr === 'lineMark' &&
                  // @ts-ignore
                  newState.doc.nodeAt(step.pos)?.type?.name === 'codeBlock'
                ) {
                  return true
                }

                return (
                  // @ts-ignore
                  step.from !== undefined &&
                  // @ts-ignore
                  step.to !== undefined &&
                  oldNodes.some((node) => {
                    // @ts-ignore
                    return (
                      // @ts-ignore
                      node.pos >= step.from &&
                      // @ts-ignore
                      node.pos + node.node.nodeSize <= step.to
                    )
                  })
                )
              })))
        ) {
          if (forceRerender) forceRerender = false

          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
            editor
          })
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      }
    },

    props: {
      decorations(state) {
        return lighterPlugin.getState(state)
      }
    },
    view: (editorView) => {
      editor = editorView
      const init = async () => {
        await preload([], 'dark-plus')
        loading = false
        editorView.dispatch(editorView.state.tr)
      }
      reloadView = () => editorView.dispatch(editorView.state.tr)
      init()

      return {
        update: () => {},
        destroy: () => {}
      }
    }
  })

  return lighterPlugin
}
