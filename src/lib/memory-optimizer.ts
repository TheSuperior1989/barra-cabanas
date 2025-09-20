/**
 * Memory Optimization Utilities
 * 
 * This module provides utilities to help manage memory usage and prevent
 * memory leaks in the application, particularly around PDF generation
 * and real-time subscriptions.
 */

interface MemoryStats {
  heapUsed: number
  heapTotal: number
  external: number
  arrayBuffers: number
  usagePercent: number
}

class MemoryOptimizer {
  private static instance: MemoryOptimizer
  private cleanupCallbacks: (() => void)[] = []
  private memoryThreshold = 100 * 1024 * 1024 // 100MB threshold

  private constructor() {
    // Start memory monitoring
    this.startMemoryMonitoring()
  }

  public static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer()
    }
    return MemoryOptimizer.instance
  }

  /**
   * Get current memory usage statistics
   */
  public getMemoryStats(): MemoryStats {
    const memUsage = process.memoryUsage()
    return {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      arrayBuffers: memUsage.arrayBuffers,
      usagePercent: (memUsage.heapUsed / memUsage.heapTotal) * 100
    }
  }

  /**
   * Register a cleanup callback to be called during memory pressure
   */
  public registerCleanupCallback(callback: () => void): void {
    this.cleanupCallbacks.push(callback)
  }

  /**
   * Force garbage collection if available
   */
  public forceGarbageCollection(): void {
    if (global.gc) {
      console.log('🗑️ Forcing garbage collection...')
      global.gc()
      const stats = this.getMemoryStats()
      console.log(`✅ GC complete. Memory usage: ${Math.round(stats.usagePercent)}%`)
    } else {
      console.log('⚠️ Garbage collection not available (run with --expose-gc)')
    }
  }

  /**
   * Perform memory cleanup when under pressure
   */
  public performCleanup(): void {
    console.log('🧹 Performing memory cleanup...')
    
    // Run all registered cleanup callbacks
    this.cleanupCallbacks.forEach((callback, index) => {
      try {
        callback()
      } catch (error) {
        console.error(`Error in cleanup callback ${index}:`, error)
      }
    })

    // Force garbage collection
    this.forceGarbageCollection()
  }

  /**
   * Check if memory usage is above threshold
   */
  public isMemoryPressure(): boolean {
    const stats = this.getMemoryStats()
    return stats.heapUsed > this.memoryThreshold || stats.usagePercent > 80
  }

  /**
   * Start monitoring memory usage
   */
  private startMemoryMonitoring(): void {
    // Check memory every 2 minutes
    setInterval(() => {
      const stats = this.getMemoryStats()
      
      if (this.isMemoryPressure()) {
        console.warn(`⚠️ High memory usage detected: ${Math.round(stats.usagePercent)}% (${Math.round(stats.heapUsed / 1024 / 1024)}MB)`)
        this.performCleanup()
      }
    }, 120000) // 2 minutes
  }

  /**
   * Log current memory usage
   */
  public logMemoryUsage(context?: string): void {
    const stats = this.getMemoryStats()
    const prefix = context ? `[${context}]` : ''
    console.log(`📊 ${prefix} Memory: ${Math.round(stats.usagePercent)}% (${Math.round(stats.heapUsed / 1024 / 1024)}MB / ${Math.round(stats.heapTotal / 1024 / 1024)}MB)`)
  }
}

// Export singleton instance
export const memoryOptimizer = MemoryOptimizer.getInstance()

// Export utility functions
export const logMemoryUsage = (context?: string) => memoryOptimizer.logMemoryUsage(context)
export const forceGarbageCollection = () => memoryOptimizer.forceGarbageCollection()
export const isMemoryPressure = () => memoryOptimizer.isMemoryPressure()

// Logo cache cleanup utility
export const clearLogoCache = () => {
  // This will be called by the PDF components to clear their caches
  console.log('🧹 Clearing logo cache...')
}
