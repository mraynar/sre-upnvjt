'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Wrap section content in a client component
export default function ActivityCarousel({ activities }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = right-to-left (next), -1 = left-to-right (prev)
  const touchStartX = useRef(null)

  // Auto-rotate
  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1)
      setCurrent(p => (p + 1) % activities.length)
    }, 4000)
    return () => clearInterval(t)
  }, [activities.length])

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        setDirection(-1)
        setCurrent(p => (p - 1 + activities.length) % activities.length)
      }
      if (e.key === 'ArrowRight') {
        setDirection(1)
        setCurrent(p => (p + 1) % activities.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activities.length])

  // Touch/trackpad swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setDirection(1)
        setCurrent(p => (p + 1) % activities.length)
      } else {
        setDirection(-1)
        setCurrent(p => (p - 1 + activities.length) % activities.length)
      }
    }
    touchStartX.current = null
  }

  const prev = () => {
    setDirection(-1)
    setCurrent(p => (p - 1 + activities.length) % activities.length)
  }

  const next = () => {
    setDirection(1)
    setCurrent(p => (p + 1) % activities.length)
  }

  const goTo = (i) => {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }

  // Get 3 visible: left, center, right
  const getIndex = (offset) => (current + offset + activities.length) % activities.length

  if (!activities || activities.length === 0) return null

  // Slide transition animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 160 : -160,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -160 : 160,
      opacity: 0,
    }),
  }

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="w-full relative select-none">
      <div className="relative overflow-hidden w-full py-2 min-h-[380px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.35, ease: "easeInOut" },
              opacity: { duration: 0.25 }
            }}
            className="flex items-center justify-center gap-4 w-full px-4"
          >
            {/* LEFT CARD */}
            <div
              className="hidden md:block w-[26%] flex-shrink-0 opacity-60 scale-90 transition-all duration-500 rounded-2xl overflow-hidden cursor-pointer"
              onClick={prev}
            >
              <div className="relative h-[200px]">
                <img
                  src={activities[getIndex(-1)].image}
                  alt={activities[getIndex(-1)].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" aria-hidden="true" />
                <h3 className="absolute bottom-3 left-3 text-white font-bold text-sm uppercase">
                  {activities[getIndex(-1)].title}
                </h3>
              </div>
            </div>

            {/* CENTER CARD — featured */}
            <div className="w-full md:w-[44%] flex-shrink-0 scale-100 z-10 shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-950/50 transition-all duration-500 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/5 bg-white dark:bg-emerald-950">
              <div className="relative h-[280px]">
                <img
                  src={activities[current].image}
                  alt={activities[current].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden="true" />
                <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </span>
                <h3 className="absolute bottom-3 left-4 text-white font-black text-base uppercase tracking-wide">
                  {activities[current].title}
                </h3>
              </div>
              <div className="p-4 transition-colors duration-300">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {activities[current].description}
                </p>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div
              className="hidden md:block w-[26%] flex-shrink-0 opacity-60 scale-90 transition-all duration-500 rounded-2xl overflow-hidden cursor-pointer"
              onClick={next}
            >
              <div className="relative h-[200px]">
                <img
                  src={activities[getIndex(1)].image}
                  alt={activities[getIndex(1)].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" aria-hidden="true" />
                <h3 className="absolute bottom-3 left-3 text-white font-bold text-sm uppercase">
                  {activities[getIndex(1)].title}
                </h3>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-900 dark:bg-amber-500 dark:hover:bg-amber-400 flex items-center justify-center transition-colors shadow-md focus-visible:outline-amber-500"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 text-slate-900 dark:text-white" />
        </button>
        <div className="flex gap-2">
          {activities.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-amber-500 ${
                i === current ? 'w-6 bg-amber-400' : 'w-2 bg-gray-400 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-9 h-9 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-900 dark:bg-amber-500 dark:hover:bg-amber-400 flex items-center justify-center transition-colors shadow-md focus-visible:outline-amber-500"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 text-slate-900 dark:text-white" />
        </button>
      </div>
    </div>
  )
}
