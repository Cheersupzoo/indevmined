import { handleImageUpload } from '@/apis/editor'
import { type Extensions } from '@tiptap/core'

import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node'

import CodeBlock from './Code'
import { CodeBlockLighter } from './CodeBlockLighter'
import { DebugEditor } from './DebugEditor'
import ExcalidrawNode from './ExcalidrawNode'
import { Box3dNode } from './React/Box3d'
import TestComponent from './TestComponent'
import { basedNodeExtensions } from './basedNodes'

export const nodeExtensions: Extensions = [
  ...basedNodeExtensions,
  TestComponent,
  CodeBlock,
  CodeBlockLighter,
  Box3dNode,
  ExcalidrawNode,
  ImageUploadNode.configure({
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024,
    limit: 3,
    upload: handleImageUpload,
    onError: (error) => console.error('Upload failed:', error),
  }),
  DebugEditor,
]
