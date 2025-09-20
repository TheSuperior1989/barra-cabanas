/**
 * Global Memory Logger
 * Logs memory usage every 10 seconds to help identify memory leaks
 */

let isLogging = false
let logInterval: NodeJS.Timeout | null = null

export function startMemoryLogging() {
  if (isLogging || typeof window !== 'undefined') {
    return // Only run on server side
  }
  
  isLogging = true
  console.log('🔍 [MEMORY LOGGER] Starting memory monitoring...')
  
  // Log immediately
  logMemoryUsage('INITIAL')
  
  // Log every 10 seconds
  logInterval = setInterval(() => {
    logMemoryUsage('PERIODIC')
  }, 10000)
}

export function stopMemoryLogging() {
  if (logInterval) {
    clearInterval(logInterval)
    logInterval = null
  }
  isLogging = false
  console.log('🔍 [MEMORY LOGGER] Stopped memory monitoring')
}

export function logMemoryUsage(context: string = 'MANUAL') {
  if (typeof window !== 'undefined') return // Only run on server side
  
  const mem = process.memoryUsage()
  const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024)
  const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024)
  const externalMB = Math.round(mem.external / 1024 / 1024)
  const rssMB = Math.round(mem.rss / 1024 / 1024)
  
  const usagePercent = Math.round((mem.heapUsed / mem.heapTotal) * 100)
  
  let severity = '✅'
  if (heapUsedMB > 150) severity = '🔴'
  else if (heapUsedMB > 100) severity = '🟡'
  else if (heapUsedMB > 50) severity = '🟠'
  
  console.log(`${severity} [MEMORY ${context}] Heap: ${heapUsedMB}MB/${heapTotalMB}MB (${usagePercent}%) | External: ${externalMB}MB | RSS: ${rssMB}MB`)
  
  // Log garbage collection suggestion if memory is high
  if (heapUsedMB > 100) {
    console.log(`🗑️ [MEMORY ${context}] High memory usage detected - consider garbage collection`)
    
    // Force garbage collection if available
    if (global.gc) {
      console.log(`🗑️ [MEMORY ${context}] Running garbage collection...`)
      global.gc()
      
      // Log after GC
      const memAfterGC = process.memoryUsage()
      const heapAfterGC = Math.round(memAfterGC.heapUsed / 1024 / 1024)
      const freed = heapUsedMB - heapAfterGC
      console.log(`🗑️ [MEMORY ${context}] GC complete - Heap: ${heapAfterGC}MB (freed ${freed}MB)`)
    }
  }
}

// Auto-start logging when module is imported (server-side only)
if (typeof window === 'undefined') {
  startMemoryLogging()
}
