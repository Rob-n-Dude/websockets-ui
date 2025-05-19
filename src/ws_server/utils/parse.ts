export type ParsedMessage = {
  type: string
  data: unknown
  id: number
}

export function parse(message: Buffer): ParsedMessage {
  const jsonString = message.toString('utf8').trim()
  const parsed = JSON.parse(jsonString)

  if (typeof parsed.data === 'string') {
    try {
      parsed.data = JSON.parse(parsed.data)
    } catch {
      parsed.data = parsed.data
    }
  }

  return parsed as ParsedMessage
}
