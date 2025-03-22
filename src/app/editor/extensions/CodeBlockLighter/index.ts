import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block'
import { LighterPlugin } from './LighterPlugin'
import { CodeBlockWrapper } from './CodeBlockWraper'
import { ReactNodeViewRenderer } from '@tiptap/react'

export interface CodeBlockLighterOptions extends CodeBlockOptions {}

export const CodeBlockLighter = CodeBlock.extend<CodeBlockLighterOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      languageClassPrefix: 'language-',
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      defaultLanguage: null,
      HTMLAttributes: {}
    }
  },
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      LighterPlugin({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage
      })
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockWrapper, {
      as: 'pre',
      attrs: {
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off',
        translate: 'no'
      }
    })
  }
})
