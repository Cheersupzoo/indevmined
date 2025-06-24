import { useRef, useState } from 'react'

import { schema } from '@tiptap/pm/schema-basic'
import { EditorState } from '@tiptap/pm/state'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { ReactStateRenderer } from './ReactStateRenderer'

export const Type4 = () => {
  const editorStateRef = useRef<EditorState>(
    EditorState.create({
      schema,
      doc: schema.nodes.doc.create(null, [
        schema.nodes.paragraph.create(null, [schema.text('hello')]),
      ]),
    })
  )
  const [showPos, setShowPos] = useState(true)

  return (
    <>
      {' '}
      <div className='absolute right-2 top-0 rounded-b-xl border-x-2 border-b-2 border-dashed border-eva-text px-1'>
        How is position calculated
      </div>
      <div className='mt-8 relative font-mono'>
        <ReactStateRenderer node={editorStateRef.current.doc} showPos={showPos} groupClassName='flex-row items-center' />
      </div>
      <div className='mt-4 flex items-center space-x-2'>
        <Switch
          id='show-pos'
          checked={showPos}
          onClick={() => {
            setShowPos((prev) => !prev)
          }}
        />
        <Label htmlFor='show-pos'>Show Position Decoration</Label>
      </div>
    </>
  )
}
