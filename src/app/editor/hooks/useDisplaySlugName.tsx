import { useAuth } from '../Auth/AuthProvider'

export const useDisplaySlugName = (id: string) => {
  const { user$ } = useAuth()
  const email = user$.email as unknown as string

  if (!id.startsWith(email)) {
    return id
  }

  return id.slice(email.length + 7)
}
