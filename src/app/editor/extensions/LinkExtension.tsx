import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core'
import { Link } from '@tiptap/extension-link'
import { createRoot } from 'react-dom/client'
import tippy from 'tippy.js'
import { LinkPopover } from './LinkExtension/LinkPopover'
import { getAttributes } from '@tiptap/core'
import { MarkType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const LinkWithConfigure = Link.extend({
  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      ...(this.parent?.() || []),
      clickHandler({ type: this.type, editor })
    ]
  }
}).configure({
  openOnClick: false, // handle onClick with custom clickHandler
  autolink: true,
  defaultProtocol: 'https',
  protocols: ['http', 'https'],
  isAllowedUri: (url, ctx) => {
    try {
      // construct URL
      const parsedUrl = url.includes(':')
        ? new URL(url)
        : new URL(`${ctx.defaultProtocol}://${url}`)

      // use default validation
      if (!ctx.defaultValidate(parsedUrl.href)) {
        return false
      }

      // disallowed protocols
      const disallowedProtocols = ['ftp', 'file', 'mailto']
      const protocol = parsedUrl.protocol.replace(':', '')

      if (disallowedProtocols.includes(protocol)) {
        return false
      }

      // only allow protocols specified in ctx.protocols
      const allowedProtocols = ctx.protocols.map((p) =>
        typeof p === 'string' ? p : p.scheme
      )

      if (!allowedProtocols.includes(protocol)) {
        return false
      }

      // disallowed domains
      const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
      const domain = parsedUrl.hostname

      if (disallowedDomains.includes(domain)) {
        return false
      }

      // all checks have passed
      return true
    } catch {
      return false
    }
  },
  linkOnPaste: true
})

export const openLinkEditor = (editor: Editor | null) => {
  if (!editor) return
  const previousUrl = editor.getAttributes('link').href

  const contentDiv = document.createElement('div')

  const popup = tippy(editor.options.element, {
    content: contentDiv,
    getReferenceClientRect: null,
    interactive: true,
    placement: 'bottom-start',
    // appendTo: () => editor.view.dom,
    trigger: 'manual',
    maxWidth: 300,
    zIndex: 1000,
    onShown: () => {
      editor.view.dom.blur()
    },
    onCreate: (instance) => {
      instance.setProps({
        getReferenceClientRect: () => {
          const { view, state } = editor
          const { from, to } = state.selection
          if (isNodeSelection(state.selection)) {
            let node = view.nodeDOM(from) as HTMLElement

            if (node) {
              const nodeViewWrapper = node.dataset.nodeViewWrapper
                ? node
                : node.querySelector('[data-node-view-wrapper]')

              if (nodeViewWrapper) {
                node = nodeViewWrapper.firstChild as HTMLElement
              }

              if (node) {
                return node.getBoundingClientRect()
              }
            }
          }

          return posToDOMRect(view, from, to)
        }
      })
      const linkPopover = (
        <LinkPopover
          editor={editor}
          closePopup={() => {
            instance.destroy()
          }}
          currentUrl={previousUrl}
        />
      )

      // Create a portal to mount the React component
      const portal = document.createElement('div')
      contentDiv.appendChild(portal)

      // Mount the React component
      const unmount = () => {
        if (portal) {
          portal.remove()
        }
      }

      // Cleanup when the popup is destroyed
      const originalDestroy = instance.destroy

      // Mount the React component
      const root = createRoot(portal)
      root.render(linkPopover)
      instance.destroy = () => {
        unmount()
        originalDestroy()
        root.unmount()
      }
    }
  })

  popup.show()
}

type ClickHandlerOptions = {
  type: MarkType
  editor: Editor
}

export function clickHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handleClickLink'),
    props: {
      handleClick: (view, pos, event) => {
        if (event.button !== 0) {
          return false
        }

        if (!view.editable) {
          return false
        }

        let a = event.target as HTMLElement
        const els = []

        while (a.nodeName !== 'DIV') {
          els.push(a)
          a = a.parentNode as HTMLElement
        }

        if (!els.find((value) => value.nodeName === 'A')) {
          return false
        }

        const attrs = getAttributes(view.state, options.type.name)
        const link = event.target as HTMLAnchorElement

        const href = link?.href ?? attrs.href

        if (link && href) {
          options.editor
            .chain()
            .setTextSelection(pos)
            .extendMarkRange('link')
            .run()
          openLinkEditor(options.editor)

          return true
        }

        return false
      }
    }
  })
}
