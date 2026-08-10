import { nextTick, onBeforeUnmount, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePageAnimations(root) {
  let context

  onMounted(async () => {
    await nextTick()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    context = gsap.context(() => {
      gsap.from('[data-page-hero] > *', {
        y: 30,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power3.out',
      })

      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 36,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 89%', once: true },
        })
      })
    }, root.value)
  })

  onBeforeUnmount(() => context?.revert())
}
