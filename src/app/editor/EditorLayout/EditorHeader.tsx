import React, { useEffect, useState } from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import { observe } from '@legendapp/state'
import { Memo, use$, useObservable } from '@legendapp/state/react'
import { Editor, EditorEvents } from '@tiptap/core'
import {
  EllipsisVertical,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

import { useEditorContext } from '../hooks/EditorProvider'
import './EditorHeader.css'
import { EditorSlugInput } from './EditorSlugInput'

export const EditorHeader = () => {
  const { docId$, status$ } = useEditorContext()
  const isMobile = useIsMobile()
  const showBrand = use$(() => !docId$.get() || !isMobile)

  return (
    <div className='sticky left-0 right-0 top-0 z-50 mx-auto w-full bg-transparent px-3 text-eva-text'>
      <div className='flex items-center justify-between py-2'>
        <div className='flex items-center gap-1'>
          <SidebarTrigger />
          <Memo>{() => docId$.get() && <EditorSlugInput />}</Memo>
        </div>
        <AnimatePresence>
          {showBrand && (
            <motion.div
              layoutId='editor-header'
              className={cn(
                'absolute left-1/2 -translate-x-1/2 select-none text-base font-medium text-eva-text/50'
              )}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              InDevMined Editor
            </motion.div>
          )}
        </AnimatePresence>
        <div className='flex items-center gap-2'>
          <div className='p-1 text-sm text-eva-text/80'>
            <Memo>{status$}</Memo>
          </div>
          <EditorLockMode />
          <EditorHeaderDropdown />
        </div>
      </div>
      <div className='backdrop' />
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
      className='rounded-sm px-0.5 py-1 hover:bg-eva-text/10'
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
        <div className='rounded-sm px-0.5 py-1 hover:bg-eva-text/10'>
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
  closeDropDown,
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
