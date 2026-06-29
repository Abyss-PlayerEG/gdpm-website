import { ref } from 'vue'

interface TouchScrollOptions {
  container: HTMLElement
  onSwipeUp: () => void
  onSwipeDown: () => void
  threshold?: number
  lockDuration?: number
}

export function useTouchScroll(options: TouchScrollOptions) {
  const {
    container,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    lockDuration = 800,
  } = options

  const isLocked = ref(false)
  let startY = 0
  let startX = 0
  let startTime = 0

  const handleTouchStart = (e: TouchEvent) => {
    if (isLocked.value) return
    startY = e.touches[0].clientY
    startX = e.touches[0].clientX
    startTime = Date.now()
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isLocked.value) {
      e.preventDefault()
      return
    }

    const currentY = e.touches[0].clientY
    const currentX = e.touches[0].clientX
    const diffY = startY - currentY
    const diffX = startX - currentX

    // Prevent horizontal scroll from triggering vertical snap
    if (Math.abs(diffX) > Math.abs(diffY)) {
      return
    }

    // Prevent default to stop rubber banding
    if (Math.abs(diffY) > 10) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (isLocked.value) return

    const endY = e.changedTouches[0].clientY
    const endX = e.changedTouches[0].clientX
    const diffY = startY - endY
    const diffX = startX - endX
    const elapsed = Date.now() - startTime

    // Ignore horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) return

    // Calculate velocity
    const velocity = Math.abs(diffY) / elapsed

    // Trigger if distance > threshold or velocity is high
    if (Math.abs(diffY) > threshold || velocity > 0.5) {
      isLocked.value = true

      if (diffY > 0) {
        onSwipeUp()
      } else {
        onSwipeDown()
      }

      setTimeout(() => {
        isLocked.value = false
      }, lockDuration)
    }
  }

  // Setup - call this to start listening
  const setup = () => {
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  // Teardown - call this to stop listening
  const teardown = () => {
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }

  // Auto-setup
  setup()

  return { isLocked, teardown }
}
