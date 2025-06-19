import { Mark, Node, Schema } from '@tiptap/pm/model'
import {
  MarkdownSerializer,
  MarkdownSerializerState,
} from 'prosemirror-markdown'

type MarkSerializerSpec = {
  /**
    The string that should appear before a piece of content marked
    by this mark, either directly or as a function that returns an
    appropriate string.
    */
  open:
    | string
    | ((
        state: MarkdownSerializerState,
        mark: Mark,
        parent: Node,
        index: number
      ) => string)
  /**
    The string that should appear after a piece of content marked by
    this mark.
    */
  close:
    | string
    | ((
        state: MarkdownSerializerState,
        mark: Mark,
        parent: Node,
        index: number
      ) => string)
  /**
    When `true`, this indicates that the order in which the mark's
    opening and closing syntax appears relative to other mixable
    marks can be varied. (For example, you can say `**a *b***` and
    `*a **b***`, but not `` `a *b*` ``.)
    */
  mixable?: boolean
  /**
    When enabled, causes the serializer to move enclosing whitespace
    from inside the marks to outside the marks. This is necessary
    for emphasis marks as CommonMark does not permit enclosing
    whitespace inside emphasis marks, see:
    http:spec.commonmark.org/0.26/#example-330
    */
  expelEnclosingWhitespace?: boolean
  /**
    Can be set to `false` to disable character escaping in a mark. A
    non-escaping mark has to have the highest precedence (must
    always be the innermost mark).
    */
  escape?: boolean
}

const defaultNode: {
  [node: string]: (
    state: MarkdownSerializerState,
    node: Node,
    parent: Node,
    index: number
  ) => void
} = {
  blockquote(state, node) {
    state.wrapBlock('> ', null, node, () => state.renderContent(node))
  },
  codeBlock(state, node) {
    // TODO: support highlightMark

    // Make sure the front matter fences are longer than any dash sequence within it
    const backticks = node.textContent.match(/`{3,}/gm)
    const fence = backticks ? backticks.sort().slice(-1)[0] + '`' : '```'

    state.write(fence + (node.attrs.params || '') + '\n')
    state.text(node.textContent, false)
    // Add a newline to the current content before adding closing marker
    state.write('\n')
    state.write(fence)
    state.closeBlock(node)
  },
  heading(state, node) {
    state.write(state.repeat('#', node.attrs.level) + ' ')
    state.renderInline(node, false)
    state.closeBlock(node)
  },
  horizontalRule(state, node) {
    state.write(node.attrs.markup || '---')
    state.closeBlock(node)
  },
  bulletList(state, node) {
    state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ')
  },
  orderedList(state, node) {
    let start = node.attrs.order || 1
    let maxW = String(start + node.childCount - 1).length
    let space = state.repeat(' ', maxW + 2)
    state.renderList(node, space, (i) => {
      let nStr = String(start + i)
      return state.repeat(' ', maxW - nStr.length) + nStr + '. '
    })
  },
  taskList(state, node) {
    state.renderList(node, '  ', () => '- ')
  },
  taskItem(state, node) {
    state.write('[')
    if (node.attrs.checked) {
      state.write('x')
    } else {
      state.write(' ')
    }
    state.write('] ')
    state.renderContent(node)
  },
  listItem(state, node) {
    state.renderContent(node)
  },
  paragraph(state, node) {
    state.renderInline(node)
    state.closeBlock(node)
  },
  image(state, node) {
    state.write(
      '![' +
        state.esc(node.attrs.alt || '') +
        '](' +
        node.attrs.src.replace(/[\(\)]/g, '\\$&') +
        (node.attrs.title
          ? ' "' + node.attrs.title.replace(/"/g, '\\"') + '"'
          : '') +
        ')'
    )
  },
  hardBreak(state, node, parent, index) {
    for (let i = index + 1; i < parent.childCount; i++)
      if (parent.child(i).type != node.type) {
        state.write('\\\n')
        return
      }
  },
  text(state, node) {
    // @ts-ignore
    state.text(node.text!, !state.inAutolink)
  },
}

const defaultMark: {
  [mark: string]: MarkSerializerSpec
} = {
  italic: {
    open: '*',
    close: '*',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  strike: {
    open: '~~',
    close: '~~',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  underline: {
    open: '<ins>',
    close: '</ins>',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  bold: {
    open: '**',
    close: '**',
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  link: {
    open(state, mark, parent, index) {
      //@ts-ignore
      state.inAutolink = isPlainURL(mark, parent, index)
      //@ts-ignore
      return state.inAutolink ? '<' : '['
    },
    close(state, mark, parent, index) {
      //@ts-ignore
      let { inAutolink } = state
      //@ts-ignore
      state.inAutolink = undefined
      return inAutolink
        ? '>'
        : '](' +
            mark.attrs.href.replace(/[\(\)"]/g, '\\$&') +
            (mark.attrs.title
              ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"`
              : '') +
            ')'
    },
    mixable: true,
  },
  code: {
    open(_state, _mark, parent, index) {
      return backticksFor(parent.child(index), -1)
    },
    close(_state, _mark, parent, index) {
      return backticksFor(parent.child(index - 1), 1)
    },
    escape: false,
  },
}

function backticksFor(node: Node, side: number) {
  let ticks = /`+/g,
    m,
    len = 0
  if (node.isText)
    while ((m = ticks.exec(node.text!))) len = Math.max(len, m[0].length)
  let result = len > 0 && side > 0 ? ' `' : '`'
  for (let i = 0; i < len; i++) result += '`'
  if (len > 0 && side < 0) result += ' '
  return result
}

function isPlainURL(link: Mark, parent: Node, index: number) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false
  let content = parent.child(index)
  if (
    !content.isText ||
    content.text != link.attrs.href ||
    content.marks[content.marks.length - 1] != link
  )
    return false
  return (
    index == parent.childCount - 1 ||
    !link.isInSet(parent.child(index + 1).marks)
  )
}

const defaultNodeKey = new Set(Object.keys(defaultNode))
// const defaultMarkKey = new Set(Object.keys(defaultMark))

export const stringifyMarkdown = (node: Node, schema?: Schema) => {
  const nodeKey = new Set(Object.keys(schema?.nodes ?? {}))
  nodeKey.delete('doc')
  const missingNodeKey = [...nodeKey.difference(defaultNodeKey)]
  // const markKey = new Set(Object.keys(schema?.marks ?? {}))
  const markdownSerializer = new MarkdownSerializer(
    {
      ...defaultNode,
      ...missingNodeKey.reduce(
        (prev, nodeType) => ({
          ...prev,
          [nodeType]: (state, node) => {
            const attrs = Object.entries(node.attrs)
            state.write(
              `<${nodeType}${
                attrs.length
                  ? ' ' +
                    attrs
                      .map(
                        ([key, value]) => `${key}="${JSON.stringify(value)}"`
                      )
                      .join(' ') +
                    ' '
                  : ''
              }>`
            )
            state.renderContent(node)
            state.write(`</${nodeType}>`)
            state.closeBlock(node)
          },
        }),
        {} as typeof defaultNode
      ),
    },
    defaultMark
  )

  return markdownSerializer.serialize(node)
}
