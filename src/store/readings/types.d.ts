export type ReadingCreate = {
  day: string
  night: string
  date: string
  created_at: string
}

export type ReadingRead = ReadingCreate & {
  id: number
}
