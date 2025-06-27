import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block'

import { CodeBlockWrapperStatic } from './static'

export interface CodeBlockLighterOptions extends CodeBlockOptions {}

export const CodeBlockLighterBased = CodeBlock.extend<CodeBlockLighterOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      lineMark: {
        default: () => [],
      },
      preview: {
        default: null,
      },
      previewCenter: {
        default: null,
      },
    }
  },
  marks: 'codeMark',
  reactNode: CodeBlockWrapperStatic,
})
