export type Reading = {
  day: string
  night: string
  date: string
}

export type ReadingCreate = Reading

export type ReadingRead = ReadingCreate & {
  id: number
}

export type ReadingState = {
  readings: Record<string, ReadingRead[]>
}
