import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'

import { PostGroupMenu } from './PostGroupMenu'
import UserDropdown from './UserDropdown'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className='text-sm text-slate-300'>
        <UserDropdown />
      </SidebarHeader>
      <SidebarContent>
        <PostGroupMenu />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
