import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import throttle from 'lodash.throttle'

export function useMouseReactivePosition(initialX, initialY, config = { ease: 0.1, scaleX: 0.5, scaleY: -0.3, throttleMs: 50 }) {
  const lerp = useRef({
    current: { x: initialX, y: initialY },
    target: { x: initialX, y: initialY },
    ease: config.ease
  })

  const position = useRef({ x: initialX, y: initialY })

  useEffect(() => {
    const handleMouseMove = throttle((e) => {
      const mouseX = ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth
      const mouseY = ((e.clientY - window.innerHeight / 2) * 2) / window.innerHeight

      lerp.current.target.x = initialX + mouseX * config.scaleX
      lerp.current.target.y = initialY + mouseY * config.scaleY
    }, config.throttleMs || 50)

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      handleMouseMove.cancel?.() // Cancel any pending throttled calls
    }
  }, [initialX, initialY, config.scaleX, config.scaleY, config.throttleMs])

  useFrame(() => {
    lerp.current.current.x += (lerp.current.target.x - lerp.current.current.x) * lerp.current.ease
    lerp.current.current.y += (lerp.current.target.y - lerp.current.current.y) * lerp.current.ease

    position.current.x = lerp.current.current.x
    position.current.y = lerp.current.current.y
  })

  return position.current
}


export function useScrollReactivePosition(initialX, initialY, config = { ease: 0.1, scrollScale: 0.02, throttleMs: 25, startScrollY: 500 }) {
  const lerp = useRef({
    current: { x: initialX, y: initialY },
    target: { x: initialX, y: initialY },
    ease: config.ease,
  })

  const position = useRef({ x: initialX, y: initialY })
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY
      
      const progress = Math.min(scrollY / (config.maxScroll || 300), 1)
      setScrollProgress(progress)

      if (scrollY >= config.startScrollY) {
        const adjustedScroll = scrollY - config.startScrollY
        lerp.current.target.y = initialY + adjustedScroll * config.scrollScale
      } else {
        lerp.current.target.y = initialY
      }
    }, config.throttleMs)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      handleScroll.cancel?.()
    }
  }, [initialY, config.scrollScale, config.throttleMs])

  useFrame(() => {
    lerp.current.current.y += (lerp.current.target.y - lerp.current.current.y) * lerp.current.ease
    position.current.x = lerp.current.current.x
    position.current.y = lerp.current.current.y
  })

  return { position: position.current, scrollProgress }
}
