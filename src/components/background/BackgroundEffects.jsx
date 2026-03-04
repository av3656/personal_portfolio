import { useEffect, useState } from 'react'
import CircuitLayer from './CircuitLayer'
import NetworkLayer from './NetworkLayer'
import BinaryRainLayer from './BinaryRainLayer'
import CodeLayer from './CodeLayer'

export default function BackgroundEffects() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="pointer-events-none fixed left-0 top-0 h-screen w-screen -z-10 overflow-hidden">
      <CircuitLayer mobile={mobile} />
      <NetworkLayer mobile={mobile} />
      {!mobile && <BinaryRainLayer mobile={mobile} />}
      <CodeLayer mobile={mobile} />
    </div>
  )
}
