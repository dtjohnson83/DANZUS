'use client'

import { useEffect, useRef } from 'react'
import styles from './home.module.css'

export function BrassEmblem() {
  const slotRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 719px)').matches
    const canvas = canvasRef.current
    const slot = slotRef.current
    if (reduce || small || !canvas || !slot) return

    let stopped = false
    let raf = 0
    let last = 0
    let seeing = true
    const observer = new IntersectionObserver((entries) => {
      seeing = entries.some((entry) => entry.isIntersecting)
    })
    observer.observe(slot)

    let dispose = () => {}
    void import('three').then((THREE) => {
      if (stopped) return
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setSize(96, 96, false)
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20)
      camera.position.z = 4.4
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.22, 40),
        new THREE.MeshStandardMaterial({ color: 0xb08d57, metalness: 0.82, roughness: 0.32 }),
      )
      body.rotation.x = Math.PI / 2.4
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.07, 10, 40),
        new THREE.MeshStandardMaterial({ color: 0xf0ddb0, metalness: 0.6, roughness: 0.35 }),
      )
      ring.rotation.x = Math.PI / 2
      const group = new THREE.Group()
      group.add(body, ring)
      scene.add(group)
      scene.add(new THREE.AmbientLight(0xfff6e8, 0.75))
      const light = new THREE.DirectionalLight(0xfffaf0, 2)
      light.position.set(2, 3, 4)
      scene.add(light)

      const tick = (now: number) => {
        raf = window.requestAnimationFrame(tick)
        if (!seeing || document.hidden || now - last < 34) return
        last = now
        const slotBox = slot.getBoundingClientRect()
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        const progress = Math.min(1, window.scrollY / max)
        const startTop = 28
        const startLeft = window.innerWidth - 96
        const top = startTop + (slotBox.top - startTop) * progress
        const left = startLeft + (slotBox.left - startLeft) * progress
        canvas.style.top = `${top}px`
        canvas.style.left = `${left}px`
        const onScreen = top > -80 && top < window.innerHeight
        if (!onScreen) return
        group.rotation.y = progress * Math.PI * 1.6
        renderer.render(scene, camera)
      }
      raf = window.requestAnimationFrame(tick)
      dispose = () => {
        renderer.dispose()
        body.geometry.dispose()
        ring.geometry.dispose()
        ;(body.material as { dispose: () => void }).dispose()
        ;(ring.material as { dispose: () => void }).dispose()
      }
    })

    return () => {
      stopped = true
      window.cancelAnimationFrame(raf)
      observer.disconnect()
      dispose()
    }
  }, [])

  return (
    <span ref={slotRef} className={styles.emblemSlot}>
      <img src="/brass-dz.svg" alt="" width={72} height={72} className={styles.emblemStill} />
      <canvas ref={canvasRef} className={styles.emblemLive} width={96} height={96} aria-hidden="true" />
    </span>
  )
}
