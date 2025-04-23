import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useAuth } from './AuthProvider'
import UserDropdown from './UserDropdown'
import { useEffect } from 'react'
import { For, Memo, Show, useObservable } from '@legendapp/state/react'
import type { Observable } from '@legendapp/state'

type TiptapDoc = {
  created_at: string
  name: string
  size: number
  updated_at: string
}

export function AppSidebar() {
  const docs$ = useObservable<TiptapDoc[] | null>(null)
  const { user$ } = useAuth()

  useEffect(() => {
    const init = async () => {
      const token = await user$.peek()?.getIdToken?.()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''}/editor/docs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (res.status !== 200) {
        return
      }

      const data = await res.json()
      if (data.docs) {
        docs$.set(data.docs)
      }
    }
    init()
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className='text-slate-300 text-sm'>
        <UserDropdown />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Posts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Show if={docs$}>
                <For each={docs$ as Observable<TiptapDoc[]>}>
                  {(doc$) => (
                    <SidebarMenuItem key={doc$.name.get()}>
                      <SidebarMenuButton asChild>
                        <div>
                          <span>{doc$.name.get()}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </For>
              </Show>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
