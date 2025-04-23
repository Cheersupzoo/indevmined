import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar'
import UserDropdown from './UserDropdown'

import { PostGroupMenu } from './PostGroupMenu'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className='text-slate-300 text-sm'>
        <UserDropdown />
      </SidebarHeader>
      <SidebarContent>
        <PostGroupMenu />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
