import {
  RouteLocationAsRelativeGeneric,
  RouteLocationAsPathGeneric,
} from 'vue-router'

export type TabBarItem = {
  icon: string
  name: string
  path:
    | string
    | RouteLocationAsRelativeGeneric
    | RouteLocationAsPathGeneric
    | undefined
  color?: string
}
