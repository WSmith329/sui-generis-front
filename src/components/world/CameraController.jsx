import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

export default function CameraController() {
    const { camera } = useThree()
    const [scrollY, setScrollY] = useState(0)
  
    useEffect(() => {
      const onScroll = () => setScrollY(window.scrollY)
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }, [])
  
    useFrame(() => {
      // Set a scroll limit and max tilt angle
      const maxTilt = Math.PI / 2 // ~30 degrees upward
      const maxScroll = 500
      const scrollRatio = Math.min(scrollY / maxScroll, 1)
  
      // Apply tilt to camera’s X rotation (up/down)
      const targetRotationX = -scrollRatio * maxTilt
      camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05
    })

  return null
}