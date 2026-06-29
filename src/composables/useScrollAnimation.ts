import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

export function useScrollAnimation() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = parseFloat(el.dataset.delay || '0')
            const animation = el.dataset.animation || 'fadeUp'

            const animations: Record<string, gsap.TweenVars> = {
              fadeUp: { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' },
              fadeDown: { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' },
              fadeLeft: { opacity: 1, x: 0, duration: 0.8, delay, ease: 'power3.out' },
              fadeRight: { opacity: 1, x: 0, duration: 0.8, delay, ease: 'power3.out' },
              scaleUp: { opacity: 1, scale: 1, duration: 0.6, delay, ease: 'back.out(1.7)' },
            }

            gsap.to(el, animations[animation] || animations.fadeUp)
            observer?.unobserve(el)
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => {
      const animation = (el as HTMLElement).dataset.animation || 'fadeUp'
      const initialStates: Record<string, gsap.TweenVars> = {
        fadeUp: { opacity: 0, y: 40 },
        fadeDown: { opacity: 0, y: -40 },
        fadeLeft: { opacity: 0, x: -40 },
        fadeRight: { opacity: 0, x: 40 },
        scaleUp: { opacity: 0, scale: 0.8 },
      }

      gsap.set(el, initialStates[animation] || initialStates.fadeUp)
      observer?.observe(el)
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
