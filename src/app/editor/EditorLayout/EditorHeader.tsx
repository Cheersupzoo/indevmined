import { SidebarTrigger } from '@/components/ui/sidebar'
import { Memo, use$, useObservable } from '@legendapp/state/react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useEditorContext } from '../hooks/EditorProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  EllipsisVertical,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  Trash2Icon,
  UploadIcon
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { EditorSlugInput } from './EditorSlugInput'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Editor, EditorEvents } from '@tiptap/core'
import { observe } from '@legendapp/state'

export const EditorHeader = () => {
  const { docId$, status$ } = useEditorContext()
  const isMobile = useIsMobile()
  const showBrand = use$(() => !docId$.get() || !isMobile)

  return (
    <div className='text-eva-text relative left-0 right-0 top-0 z-50 mx-auto  w-full bg-transparent px-3'>
      <div className='flex items-center py-2 justify-between'>
        <div className='flex gap-1 items-center'>
          <SidebarTrigger />
          <Memo>{() => docId$.get() && <EditorSlugInput />}</Memo>
        </div>
        <AnimatePresence>
          {showBrand && (
            <motion.div
              layoutId='editor-header'
              className={cn(
                'select-none absolute left-1/2 -translate-x-1/2 text-eva-text/50 font-medium text-base'
              )}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              InDevMined Editor
            </motion.div>
          )}
        </AnimatePresence>
        <div className='flex items-center gap-2'>
          <div className='text-sm text-eva-text/80 p-1'>
            <Memo>{status$}</Memo>
          </div>
          <EditorLockMode />
          <EditorHeaderDropdown />
        </div>
      </div>
    </div>
  )
}

const EditorLockMode = () => {
  const { docId$, currentEditor } = useEditorContext()
  const docId = use$(docId$)
  const isEditable = useObservable(!!currentEditor.peek()?.isEditable)

  useEffect(() => {
    return observe((e) => {
      const editor = currentEditor.get() as Editor | null
      if (!editor) return
      const onUpdate = ({ editor }: EditorEvents['update']) => {
        isEditable.set(editor.isEditable)
      }

      editor.on('update', onUpdate)
      e.onCleanup = () => {
        editor.off('update', onUpdate)
      }
    })
  })

  if (!docId) {
    return <></>
  }

  return (
    <div
      className='px-0.5 py-1 hover:bg-eva-text/10 rounded-sm'
      onClick={() =>
        currentEditor.peek()?.setEditable(!currentEditor.peek().isEditable)
      }
    >
      <Memo>
        {() =>
          isEditable.get() ? (
            <LockKeyholeOpenIcon size={16} />
          ) : (
            <LockKeyholeIcon size={16} />
          )
        }
      </Memo>
    </div>
  )
}

const EditorHeaderDropdown = () => {
  const { deleteDoc, docId$, exportDoc } = useEditorContext()
  const docId = use$(docId$)
  const [open, setOpen] = useState(false)

  if (!docId) {
    return <></>
  }

  return (
    <DropdownMenu open={open} onOpenChange={(open) => !open && setOpen(open)}>
      <DropdownMenuTrigger asChild onClick={() => setOpen(true)}>
        <div className='px-0.5 py-1 hover:bg-eva-text/10 rounded-sm'>
          <EllipsisVertical size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className='w-52'
      >
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UploadIcon size={16} /> Export
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => exportDoc('json')}>
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportDoc('html')}>
                  HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportDoc('yjs')}>
                  YJS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportDoc('md')}>
                  Markdown
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DeleteDialog
            onDelete={() => deleteDoc(docId)}
            closeDropDown={() => setOpen(false)}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const DeleteDialog = ({
  onDelete,
  closeDropDown
}: {
  onDelete: () => void
  closeDropDown?: () => void
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className='data-[highlighted]:text-red-500'
        >
          <Trash2Icon size={16} /> Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-eva-text'>
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='border-eva-text text-eva-text'>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onDelete()
              closeDropDown?.()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
