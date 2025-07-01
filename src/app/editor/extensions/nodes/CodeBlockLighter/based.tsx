import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block'

// import { CodeBlockWrapperStatic } from './static'
import { CodeBlockStatic } from './CodeBlockStatic'

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
  reactNode: CodeBlockStatic,
})
