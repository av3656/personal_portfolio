import { useEffect } from 'react'

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = `${title} | Aman Verma`

    const existing = document.querySelector('meta[name="description"]')
    if (existing) {
      existing.setAttribute('content', description)
      return
    }

    const meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    meta.setAttribute('content', description)
    document.head.appendChild(meta)
  }, [title, description])
}
