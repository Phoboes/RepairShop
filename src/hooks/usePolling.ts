import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const usePolling = (
  searchParam: string | null,
  interval: number = 60000,
) => {
  const router = useRouter()

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('polling')
      if (!searchParam) {
        console.log('Refreshing data')
        router.refresh()
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [interval, searchParam]) // eslint-disable-line react-hooks/exhaustive-deps
}
