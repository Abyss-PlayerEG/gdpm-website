import { ref, render, h } from 'vue'
import Modal from '../components/Modal.vue'

interface ModalOptions {
  title?: string
  content?: string
  width?: string
  closable?: boolean
  maskClosable?: boolean
  onClose?: () => void
}

export function useModal() {
  const isOpen = ref(false)

  const open = (options: ModalOptions = {}) => {
    const container = document.createElement('div')
    container.id = `modal-${Date.now()}`
    document.body.appendChild(container)

    let isClosing = false

    const closeModal = () => {
      if (isClosing) return
      isClosing = true

      // Trigger close animation by setting visible to false
      render(
        h(Modal, {
          visible: false,
          title: options.title,
          content: options.content,
          width: options.width,
          closable: options.closable ?? true,
          maskClosable: options.maskClosable ?? true,
          'onUpdate:visible': () => {},
        }),
        container
      )

      // Wait for animation to complete before removing
      setTimeout(() => {
        render(null, container)
        container.remove()
        isOpen.value = false
        options.onClose?.()
      }, 300)
    }

    const renderModal = (visible: boolean) => {
      render(
        h(Modal, {
          visible,
          title: options.title,
          content: options.content,
          width: options.width,
          closable: options.closable ?? true,
          maskClosable: options.maskClosable ?? true,
          'onUpdate:visible': (val: boolean) => {
            if (!val) closeModal()
          },
        }),
        container
      )
    }

    // First render hidden, then show to trigger entrance animation
    renderModal(false)
    requestAnimationFrame(() => {
      renderModal(true)
    })

    isOpen.value = true
  }

  return { isOpen, open }
}
