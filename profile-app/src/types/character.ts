export type CharacterData = {
  id: number
  name?: string | null
  image?: string | null
  status?: string | null
  species?: string | null
  gender?: string | null
  origin?: { name?: string | null } | null
  location?: { name?: string | null } | null
}

export type CharacterResponse = {
  info?: {
    next?: string | null
    pages?: number
  }
  results?: CharacterData[]
}
