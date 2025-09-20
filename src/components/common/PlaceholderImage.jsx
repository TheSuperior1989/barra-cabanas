'use client'

import React, { useMemo } from 'react'

// PlaceholderImageProps:
// - width?: number
// - height?: number
// - text?: string
// - bgColor?: string
// - textColor?: string
// - className?: string

const PlaceholderImage = ({
  width = 800,
  height = 600,
  text = 'Placeholder Image',
  bgColor = '#4361ee',
  textColor = '#ffffff',
  className = ''
}) => {
  // PERFORMANCE: Memoize the SVG data URL to prevent regeneration
  const placeholderDataURL = useMemo(() => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(width / 20)}"
              fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
          ${text}
        </text>
      </svg>
    `
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }, [width, height, text, bgColor, textColor])

  return (
    <img
      src={placeholderDataURL}
      alt={text}
      width={width}
      height={height}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  )
}

export default PlaceholderImage;
