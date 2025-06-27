import { Metadata } from 'next'

import { AnyExtension, getSchema } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'

import Layout, { NormalResponsive } from '@/components/Layout'
import '@/styles/markdown.css'

import { staticMarkExtensions } from '../editor/extensions/marks/staticMark'
import { staticNodeExtensions } from '../editor/extensions/nodes/staticNodes'
import { NodeRenderer } from './Renderer'

export const metadata: Metadata = {
  title: 'Preview | In Dev Mined',
  description: 'In Dev Mined WYSIWYG Editor',
}

const extensions = [...staticNodeExtensions, ...staticMarkExtensions]
const nodeExtensionKV = staticNodeExtensions.reduce(
  (prev, cur) => {
    prev[cur.name] = cur
    return prev
  },
  {} as Record<string, AnyExtension>
)
const schema = getSchema(extensions)

export default async function PreviewPage() {
  const contentNode = Node.fromJSON(schema, json)
  const children: React.ReactElement[] = []
  contentNode.content.forEach((node, index) => {
    children.push(
      <NodeRenderer key={index} node={node} nodeExtensionKV={nodeExtensionKV} />
    )
  })

  return (
    <Layout>
      <NormalResponsive>
        <div className='markdown-body text-eva-text'>{children}</div>
      </NormalResponsive>
    </Layout>
  )
}

const json = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        level: 1,
      },
      content: [
        {
          type: 'text',
          text: 'H1',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'H2',
        },
      ],
    },
    {
      type: 'heading',
      attrs: {
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'H3',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://github.com/google-gemini/gemini-cli',
                target: '_blank',
                rel: 'noopener noreferrer nofollow',
                class: null,
              },
            },
          ],
          text: 'This',
        },
        {
          type: 'text',
          text: ' is paragraph',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Bullet List',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'orderedList',
      attrs: {
        start: 1,
        type: null,
      },
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Ordered List',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: {
            checked: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Task List',
                },
              ],
            },
          ],
        },
        {
          type: 'taskItem',
          attrs: {
            checked: true,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Task but checked',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'horizontalRule',
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is quote',
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'bold ',
        },
        {
          type: 'text',
          text: 'and ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'textDecorationMark',
              attrs: {
                num: 2,
              },
            },
          ],
          text: 'color',
        },
      ],
    },
    {
      type: 'toggleSection',
      attrs: {
        collapsed: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Togglable',
            },
          ],
        },
        {
          type: 'groupBlock',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Hidable content',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'reactComponent',
      attrs: {
        count: 28,
      },
      content: [
        {
          type: 'react-component-box3d',
        },
      ],
    },
    {
      type: 'debugEditor',
      attrs: {
        type: 1,
      },
    },
    {
      type: 'paragraph',
    },
    {
      type: 'debugEditor',
      attrs: {
        type: 2,
      },
    },
    {
      type: 'codeBlock',
      attrs: {
        language: 'js',
        lineMark: [],
        preview: null,
        previewCenter: null,
      },
      content: [
        {
          type: 'text',
          text: "const js = 'is running'",
        },
      ],
    },
    {
      type: 'paragraph',
    },
  ],
}
