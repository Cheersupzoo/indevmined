import { deleteImage, handleImageUpload } from '@/apis/editor'
import { type Extensions } from '@tiptap/core'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'

import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node'

import CodeBlock from './Code'
import { CodeBlockLighter } from './CodeBlockLighter'
import { CustomImage } from './CustomImage'
import { DebugEditor } from './DebugEditor'
import ExcalidrawNode from './ExcalidrawNode'
import { GroupBlock } from './GroupBlock'
import { Box3dNode } from './React/Box3d'
import TestComponent from './TestComponent/extension'
import ToggleSection from './ToggleSection'

export const nodeExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    history: false,
  }),

  // Node
  CustomImage.configure({
    deleteImage(url) {
      if (url.startsWith('https://cdn.indevmined.com')) {
        const key = url.replace('https://cdn.indevmined.com/', '')
        deleteImage(key)
      }
    },
  }),
  // TODO: Remove TestComponent
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
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  GroupBlock,
  ToggleSection,
  DebugEditor,
]
