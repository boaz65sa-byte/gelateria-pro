/**
 * Elegant SVG placeholder for dish gallery, shown when an image
 * file doesn't exist yet in public/images/.
 */

const palettes = {
  gold: { bg: '#FBF7EC', stroke: '#C9A961', accent: '#8E7238' },
  amber: { bg: '#FAEEDA', stroke: '#BA7517', accent: '#854F0B' },
  ivory: { bg: '#F5F3EE', stroke: '#A8A49A', accent: '#5A5750' },
}

export function DishPlaceholder({ dishId, color = 'gold', className = '' }) {
  const p = palettes[color] || palettes.gold

  if (dishId === 'waffle-stick') {
    return (
      <svg className={className} viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="220" fill={p.bg} />
        <line x1="150" y1="200" x2="150" y2="130" stroke={p.accent} strokeWidth="3" strokeLinecap="round" />
        <rect x="110" y="60" width="80" height="80" rx="6" fill="#F3E9C9" stroke={p.stroke} strokeWidth="1.5" />
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={116 + col * 17}
              y={66 + row * 17}
              width="12"
              height="12"
              rx="1"
              fill="none"
              stroke={p.stroke}
              strokeWidth="0.8"
            />
          ))
        )}
        <ellipse cx="150" cy="60" rx="40" ry="14" fill={p.accent} opacity="0.3" />
        <circle cx="135" cy="55" r="3" fill={p.accent} />
        <circle cx="165" cy="58" r="2.5" fill={p.accent} />
        <circle cx="150" cy="48" r="2" fill={p.accent} />
      </svg>
    )
  }

  if (dishId === 'mini-pancakes') {
    return (
      <svg className={className} viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="220" fill={p.bg} />
        <ellipse cx="150" cy="140" rx="110" ry="50" fill="#FFFFFF" stroke={p.stroke} strokeWidth="1.5" />
        <ellipse cx="150" cy="135" rx="95" ry="40" fill={p.bg} />
        {[
          [110, 130], [140, 125], [170, 128], [200, 132],
          [125, 145], [155, 148], [185, 145],
          [140, 160], [165, 158],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" fill="#F3E9C9" stroke={p.stroke} strokeWidth="1" />
        ))}
        <circle cx="130" cy="105" r="18" fill="#FFFFFF" stroke={p.stroke} strokeWidth="1.2" />
        <circle cx="170" cy="105" r="18" fill="#E8D59A" stroke={p.stroke} strokeWidth="1.2" />
        <path d="M150 85 Q155 70 160 80 Q165 72 168 85" fill={p.accent} opacity="0.6" />
      </svg>
    )
  }

  if (dishId === 'crepe') {
    return (
      <svg className={className} viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="220" fill={p.bg} />
        <ellipse cx="150" cy="170" rx="120" ry="20" fill="#FFFFFF" stroke={p.stroke} strokeWidth="1" />
        <path
          d="M 90 160 L 210 160 L 180 60 Z"
          fill="#F3E9C9"
          stroke={p.stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M 110 150 L 190 150 L 170 80 Z"
          fill={p.bg}
          opacity="0.6"
        />
        <path d="M 120 140 Q 150 110 180 140" stroke={p.accent} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="140" cy="120" r="4" fill="#D4537E" />
        <circle cx="165" cy="130" r="5" fill="#D4537E" />
        <circle cx="155" cy="110" r="3" fill="#D4537E" />
        <path d="M 100 50 L 110 40 M 115 45 L 120 35 M 125 40 L 130 30" stroke={p.accent} strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }

  // Default ice cream placeholder
  return (
    <svg className={className} viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="220" fill={p.bg} />
      <path d="M 150 30 Q 130 30 125 55 Q 105 55 110 80 Q 95 85 105 100 L 195 100 Q 205 85 190 80 Q 195 55 175 55 Q 170 30 150 30 Z"
        fill="#FFFFFF" stroke={p.stroke} strokeWidth="1.5" />
      <path d="M 105 100 L 150 200 L 195 100 Z" fill="#F3E9C9" stroke={p.stroke} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Smart image wrapper: tries to load the file path,
 * falls back to placeholder on error.
 */
import { useState } from 'react'

export function DishImage({ dish, className = '' }) {
  const [failed, setFailed] = useState(false)
  const hasPath = dish.imagePath && !failed

  return (
    <div className={`relative overflow-hidden rounded-lg bg-ivory dark:bg-charcoal-700 ${className}`}>
      {hasPath ? (
        <img
          src={dish.imagePath}
          alt={dish.name}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <DishPlaceholder dishId={dish.id} color={dish.color} className="w-full h-full" />
      )}
    </div>
  )
}
