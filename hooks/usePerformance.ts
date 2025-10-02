'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// Implementação própria de debounce
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T => {
  let timeout: NodeJS.Timeout | null = null
  let lastCallTime = 0
  let lastInvokeTime = 0
  let lastArgs: any[] = []
  let lastThis: any
  let result: any

  const { leading = false, trailing = true } = options

  const invokeFunc = (time: number) => {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = []
    lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  const leadingEdge = (time: number) => {
    lastInvokeTime = time
    timeout = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : result
  }

  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return timeWaiting
  }

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (timeSinceLastInvoke >= wait)
    )
  }

  const timerExpired = () => {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timeout = setTimeout(timerExpired, remainingWait(time))
  }

  const trailingEdge = (time: number) => {
    timeout = null
    if (trailing && lastArgs.length) {
      return invokeFunc(time)
    }
    lastArgs = []
    lastThis = undefined
    return result
  }

  const debounced = function (this: any, ...args: any[]) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime)
      }
      if (trailing) {
        timeout = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait)
    }
    return result
  }

  return debounced as T
}

// Implementação própria de throttle
const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T => {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0

  const { leading = true, trailing = true } = options

  const throttled = function (this: any, ...args: any[]) {
    const now = Date.now()
    if (!previous && !leading) previous = now
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = !leading ? 0 : Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }

  return throttled as T
}

// Hook para lazy loading de componentes
export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, hasLoaded])

  return { isVisible, elementRef }
}

// Hook para debounce de valores
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook para throttle de funções
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const throttledCallback = useRef(
    throttle(callback, delay, { leading: true, trailing: true })
  )

  useEffect(() => {
    throttledCallback.current = throttle(callback, delay, { leading: true, trailing: true })
  }, [callback, delay])

  return throttledCallback.current as T
}

// Hook para memoização de cálculos pesados
export const useMemoizedCalculation = <T>(
  calculation: () => T,
  dependencies: any[]
): T => {
  return useMemo(() => {
    const start = performance.now()
    const result = calculation()
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Calculation took ${end - start} milliseconds`)
    }
    
    return result
  }, dependencies)
}

// Hook para virtualização de listas grandes
export const useVirtualization = (
  items: any[],
  containerHeight: number,
  itemHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = items.slice(visibleStart, visibleEnd)
  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight

  const handleScroll = useCallback(
    throttle((e: Event) => {
      const target = e.target as HTMLElement
      setScrollTop(target.scrollTop)
    }, 16), // 60fps
    []
  )

  useEffect(() => {
    if (containerRef) {
      containerRef.addEventListener('scroll', handleScroll)
      return () => containerRef.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, handleScroll])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setContainerRef
  }
}

// Hook para cache de dados com TTL
export const useDataCache = <T>(key: string, ttl: number = 5 * 60 * 1000) => {
  const [cache, setCache] = useState<Map<string, { data: T; timestamp: number }>>(new Map())
  const [isLoading, setIsLoading] = useState(false)

  const getCachedData = useCallback((cacheKey: string): T | null => {
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }
    return null
  }, [cache, ttl])

  const setCachedData = useCallback((cacheKey: string, data: T) => {
    setCache(prev => new Map(prev.set(cacheKey, { data, timestamp: Date.now() })))
  }, [])

  const invalidateCache = useCallback((cacheKey?: string) => {
    if (cacheKey) {
      setCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(cacheKey)
        return newCache
      })
    } else {
      setCache(new Map())
    }
  }, [])

  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    isLoading,
    setIsLoading
  }
}

// Hook para otimização de re-renders
export const useOptimizedState = <T>(initialValue: T) => {
  const [state, setState] = useState(initialValue)
  const stateRef = useRef(state)
  const updateQueueRef = useRef<T[]>([])

  const setOptimizedState = useCallback((newValue: T | ((prev: T) => T)) => {
    const value = typeof newValue === 'function' ? (newValue as (prev: T) => T)(stateRef.current) : newValue
    
    if (value !== stateRef.current) {
      stateRef.current = value
      updateQueueRef.current.push(value)
      
      // Batch updates para reduzir re-renders
      requestAnimationFrame(() => {
        if (updateQueueRef.current.length > 0) {
          const latestValue = updateQueueRef.current[updateQueueRef.current.length - 1]
          setState(latestValue)
          updateQueueRef.current = []
        }
      })
    }
  }, [])

  return [state, setOptimizedState] as const
}

// Hook para performance monitoring
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0
  })

  const measureRender = useCallback((componentName: string, renderFn: () => void) => {
    const start = performance.now()
    renderFn()
    const end = performance.now()
    
    const renderTime = end - start
    
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.max(prev.renderTime, renderTime)
    }))
    
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
    }
  }, [])

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
      }))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(measureMemory, 5000)
    return () => clearInterval(interval)
  }, [measureMemory])

  return {
    metrics,
    measureRender,
    measureMemory
  }
}

// Hook para otimização de imagens
export const useImageOptimization = (src: string, options?: {
  lazy?: boolean
  placeholder?: string
  quality?: number
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(!options?.lazy)
  const imgRef = useRef<HTMLImageElement>(null)

  const { isVisible, elementRef } = useLazyLoading()

  useEffect(() => {
    if (options?.lazy && isVisible) {
      setIsInView(true)
    }
  }, [isVisible, options?.lazy])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setIsError(false)
  }, [])

  const handleError = useCallback(() => {
    setIsError(true)
    setIsLoaded(false)
  }, [])

  const optimizedSrc = useMemo(() => {
    if (!src) return ''
    
    // Adicionar parâmetros de otimização se necessário
    const url = new URL(src, window.location.origin)
    if (options?.quality) {
      url.searchParams.set('q', options.quality.toString())
    }
    
    return url.toString()
  }, [src, options?.quality])

  return {
    src: isInView ? optimizedSrc : '',
    placeholder: options?.placeholder,
    isLoaded,
    isError,
    isInView,
    imgRef: options?.lazy ? elementRef : imgRef,
    onLoad: handleLoad,
    onError: handleError
  }
}

// Hook para otimização de listas
export const useListOptimization = <T>(
  items: T[],
  options?: {
    pageSize?: number
    virtualScrolling?: boolean
    containerHeight?: number
    itemHeight?: number
  }
) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  
  const pageSize = options?.pageSize || 20
  
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items
    return items.filter(item => 
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])
  
  const paginatedItems = useMemo(() => {
    const start = currentPage * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage, pageSize])
  
  const totalPages = Math.ceil(filteredItems.length / pageSize)
  
  const virtualization = useVirtualization(
    filteredItems,
    options?.containerHeight || 400,
    options?.itemHeight || 50
  )
  
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)))
  }, [totalPages])
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])
  
  return {
    items: options?.virtualScrolling ? virtualization.visibleItems : paginatedItems,
    currentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0,
    virtualization: options?.virtualScrolling ? virtualization : null
  }
}

// Hook para otimização de formulários
export const useFormOptimization = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debouncedValues = useDebounce(values, 300)
  
  const validate = useCallback((vals: T) => {
    if (!validationSchema) return {}
    return validationSchema(vals)
  }, [validationSchema])
  
  const debouncedValidation = useDebounce(
    () => {
      const newErrors = validate(debouncedValues)
      setErrors(newErrors)
    },
    500
  )
  
  useEffect(() => {
    debouncedValidation()
  }, [debouncedValues, debouncedValidation])
  
  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])
  
  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])
  
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])
  
  const isValid = Object.keys(errors).length === 0
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    setIsSubmitting,
    reset
  }
}

