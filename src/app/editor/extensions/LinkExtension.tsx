import { Editor } from '@tiptap/core'
import Link from '@tiptap/extension-link'
import { useCallback } from 'react'

export const LinkWithConfigure = Link.configure({
  openOnClick: true,
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

export const useSetLink = (editor: Editor | null) => {
  return useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    } catch (e: any) {
      alert(e.message)
    }
  }, [editor])
}
