'use client'

import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  ReactRenderer,
} from '@tiptap/react'
import tippy from 'tippy.js'

import { CodeBlockDropdown } from './CodeBlockDropdown'
import { CodeBlockWrapper } from './CodeBlockWraper'
import { LanguageSelector } from './LanguageSelector'

const Dropdown = (props: NodeViewProps) => {
  return (
    <CodeBlockDropdown
      preview={props.node.attrs.preview}
      togglePreview={() => {
        props.updateAttributes({
          preview: !props.node.attrs.preview,
        })
      }}
      center={props.node.attrs.previewCenter}
      toggleCenter={() =>
        props.updateAttributes({
          previewCenter: !props.node.attrs.previewCenter,
        })
      }
    />
  )
}

const onClickLanguageSelector = (
  event: React.MouseEvent,
  props: NodeViewProps
) => {
  if (!props.editor) return
  const component = new ReactRenderer(LanguageSelector, {
    editor: props.editor,
    props: {
      currentLanguage: props.node.attrs.language,
    },
  })
  const spanEl = event.currentTarget
  const codeEl = spanEl.parentElement!

  const popup = tippy(event.currentTarget, {
    appendTo: () => codeEl,
    getReferenceClientRect: () => {
      if (!spanEl) {
        return {
          width: 0,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        } as DOMRect
      }
      const pos = spanEl.getBoundingClientRect()

      return pos
    },
    content: component.element,
    showOnCreate: true,
    interactive: true,
    trigger: 'manual',
    placement: 'bottom-start',
  })
  component.updateProps({
    editor: props.editor,
    updateLanguage: (language: string) => props.updateAttributes({ language }),
    closePopup: () => popup.hide(),
  })
}

const CodeBlock = (props: NodeViewProps) => {
  return (
    <CodeBlockWrapper
      Wrapper={NodeViewWrapper}
      WrapperAttr={{ id: props.node.attrs.id }}
      Dropdown={Dropdown}
      onClickLanguageSelector={onClickLanguageSelector}
      CodeRenderer={
        <NodeViewContent as='code' className='relative z-0 text-[0.9rem]' />
      }
      {...props}
    />
  )
}

export const CodeBlockWrapperRenderer = ReactNodeViewRenderer(CodeBlock, {
  as: 'pre',
  attrs: {
    spellcheck: 'false',
    autocorrect: 'off',
    autocapitalize: 'off',
    translate: 'no',
  },
})
