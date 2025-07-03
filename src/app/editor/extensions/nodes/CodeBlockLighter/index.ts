import { CodeBlockOptions } from '@tiptap/extension-code-block'
import { TextSelection } from '@tiptap/pm/state'
import { mergeAttributes } from '@tiptap/react'

import { CodeBlockWrapperRenderer } from './CodeBlock'
import { LighterPlugin } from './LighterPlugin'
import { CodeBlockLighterBased } from './based'

export interface CodeBlockLighterOptions extends CodeBlockOptions {}

export const CodeBlockLighter =
  CodeBlockLighterBased.extend<CodeBlockLighterOptions>({
    addOptions() {
      return {
        ...this.parent?.(),
        languageClassPrefix: 'language-',
        exitOnTripleEnter: true,
        exitOnArrowDown: true,
        defaultLanguage: 'typescript',
        HTMLAttributes: {},
      }
    },
    renderHTML({ node, HTMLAttributes }) {
      return [
        'pre',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        [
          'code',
          {
            class: node.attrs.language
              ? this.options.languageClassPrefix + node.attrs.language
              : null,
            language: node.attrs.language,
            lineMark: node.attrs.lineMark.join(','),
          },
          0,
        ],
      ]
    },
    addProseMirrorPlugins() {
      return [
        ...(this.parent?.() || []),
        LighterPlugin({
          name: this.name,
          defaultLanguage: this.options.defaultLanguage,
        }),
      ]
    },
    addNodeView() {
      return CodeBlockWrapperRenderer
    },
    addKeyboardShortcuts() {
      return {
        'Mod-a': () =>
          // Select all
          this.editor.commands.command(({ tr, state }) => {
            if (state.selection.$from.parent.type.name === this.name) {
              const start =
                state.selection.$from.pos - state.selection.$from.parentOffset
              const end =
                start + state.selection.$from.parent.firstChild!.nodeSize
              const newSelection = TextSelection.create(tr.doc, start, end)
              tr.setSelection(newSelection)

              return true
            }

            return false
          }),
      }
    },
  })
