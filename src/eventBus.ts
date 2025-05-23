import mitt, { EventType } from 'mitt'

const emitter = mitt<Record<EventType, unknown>>()

export default emitter
