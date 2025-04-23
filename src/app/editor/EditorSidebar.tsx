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
import { useEffect, useState } from 'react'

type TiptapDoc = {
  created_at: string
  name: string
  size: number
  updated_at: string
}

export function AppSidebar() {
  const { user } = useAuth()
  const [docs, setDocs] = useState<TiptapDoc[] | null>(null)

  useEffect(() => {
    const init = async () => {
      const token = await user?.getIdToken()
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
        setDocs(data.docs)
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
              {docs &&
                docs.map((doc) => (
                  <SidebarMenuItem key={doc.name}>
                    <SidebarMenuButton asChild>
                      <div>
                        <span>{doc.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
