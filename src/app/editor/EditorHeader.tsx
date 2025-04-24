import { SidebarTrigger } from '@/components/ui/sidebar'
import { Memo, use$ } from '@legendapp/state/react'
import { motion } from 'motion/react'
import React, { useState } from 'react'
import { useEditorContext } from './EditorProvider'
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
import { EllipsisVertical, Trash2Icon, UploadIcon } from 'lucide-react'
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

export const EditorHeader = () => {
  const { docId$, status$ } = useEditorContext()
  return (
    <div className='text-eva-text relative left-0 right-0 top-0 z-50 mx-auto  w-full bg-transparent px-3'>
      <div className='flex items-center py-2 justify-between'>
        <div className='flex gap-1 items-center'>
          <SidebarTrigger />
          <div className='text-eva-text hover:bg-eva-text/5 px-1.5 rounded-md'>
            <Memo>{docId$}</Memo>
          </div>
        </div>
        <motion.div
          layoutId='editor-header'
          className='select-none absolute left-1/2 -translate-x-1/2 text-eva-text/50 font-medium text-base'
        >
          InDevMined Editor
        </motion.div>
        <div className='flex items-center gap-2'>
          <div className='text-sm text-eva-text/80 p-1'>
            <Memo>{status$}</Memo>
          </div>
          <EditorHeaderDropdown />
        </div>
      </div>
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
        <div className='px-0.5 py-1 hover:bg-eva-text/5 rounded-sm'>
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
