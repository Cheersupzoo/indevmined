import { Extensions } from '@tiptap/core'

import { CodeBased } from './Code/based'
import { CodeBlockLighterBased } from './CodeBlockLighter/based'
import { DebugEditorBased } from './DebugEditor/based'
import { ExcalidrawNodeBased } from './ExcalidrawNode/based'
import { Box3dNodeBased } from './React/based'
import { TestComponentBased } from './TestComponent/based'
import { basedNodeExtensions } from './basedNodes'

export const staticNodeExtensions: Extensions = [
  ...basedNodeExtensions,
  TestComponentBased,
  CodeBased,
  CodeBlockLighterBased,
  Box3dNodeBased,
  ExcalidrawNodeBased,
  DebugEditorBased,
]
