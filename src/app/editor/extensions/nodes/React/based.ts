import { Node } from '@tiptap/core'

import { Box3dStatic } from './static'

export const Box3dNodeBased = Node.create({
  name: 'react-component-box3d',
  reactNode: Box3dStatic,
})
