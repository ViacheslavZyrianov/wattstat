import { TabBarItem } from '@/App/components/TabBar/types'

const tabBarItems: TabBarItem[] = [
  { icon: 'list-switching', name: 'Dashboard', path: '/dashboard' },
  { icon: 'user-o', name: 'Profile', path: '/profile' },
  { icon: 'add', name: '', path: '', color: '#07c160' },
  { icon: 'orders-o', name: 'Readings', path: '/readings' },
  { icon: 'setting-o', name: 'Settings', path: '/settings' },
]

export default tabBarItems
