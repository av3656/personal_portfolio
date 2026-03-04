import { useEffect, useState } from 'react'
import { FloatingJavaCode } from './FloatingJavaCode'

const snippets = [
  {
    snippet: 'public class BinarySearchTree {}',
    top: '20%',
    left: '8%',
    rotate: -2,
    duration: 7,
  },
  {
    snippet: '@RestController\\npublic class UserController {}',
    top: '35%',
    right: '10%',
    rotate: 2,
    duration: 9,
  },
  {
    snippet: 'public static void main(String[] args) {}',
    top: '58%',
    left: '12%',
    rotate: 1,
    duration: 11,
  },
  {
    snippet: 'List<String> users = new ArrayList<>();',
    top: '72%',
    right: '8%',
    rotate: -1,
    duration: 8,
  },
  {
    snippet: 'Map<String, Integer> cache = new HashMap<>();',
    top: '44%',
    left: '62%',
    rotate: 3,
    duration: 10,
  },
  {
    snippet: 'Optional<User> user = repo.findById(id);',
    top: '84%',
    left: '36%',
    rotate: -3,
    duration: 12,
  },
]

export function FloatingCodeLayer() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const visibleSnippets = mobile ? snippets.slice(0, 3) : snippets

  return (
    <div className="pointer-events-none fixed left-0 top-0 h-full w-full -z-10 overflow-hidden" aria-hidden="true">
      {visibleSnippets.map((item, idx) => (
        <FloatingJavaCode
          key={item.snippet}
          snippet={item.snippet}
          top={item.top}
          left={item.left}
          right={item.right}
          rotate={item.rotate}
          duration={item.duration}
          delay={idx * 0.5}
          mobile={mobile}
        />
      ))}
    </div>
  )
}
