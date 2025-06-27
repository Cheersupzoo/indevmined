import { Node } from '@tiptap/core'
import { ReactComponent } from './static'

export const TestComponentBased = Node.create({
  name: 'reactComponent',

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },
  reactNode: ReactComponent,
})
