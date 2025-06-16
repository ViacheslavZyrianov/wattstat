import { TabBarItem } from '@/App/components/TabBar/types'

const tabBarItems: TabBarItem[] = [
  { icon: 'mdi-view-dashboard-outline', path: '/dashboard' },
  { icon: 'mdi-list-box-outline', path: '/readings' },
  { icon: 'mdi-account-outline', path: '/profile' },
  { icon: 'mdi-cog-outline', path: '/settings' },
]

export default tabBarItems
