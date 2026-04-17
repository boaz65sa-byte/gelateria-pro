import { useState } from 'react'
import { RecipeCard } from './RecipeCard.jsx'
import { recipes } from '../../data/recipes.js'

const recipeVisual = {
  crepe:   { emoji:'🥞', bg:'bg-amber-50  dark:bg-amber-900/20',  border:'border-amber-200 dark:border-amber-700',  activeBg:'bg-amber-100  dark:bg-amber-800/40',  it:'Crêpe'   },
  waffle:  { emoji:'🧇', bg:'bg-terra-50  dark:bg-terra-900/20',  border:'border-terra-200 dark:border-terra-700',  activeBg:'bg-terra-100  dark:bg-terra-800/40',  it:'Waffle'  },
  pancake: { emoji:'🥞', bg:'bg-yellow-50 dark:bg-yellow-900/20', border:'border-yellow-200 dark:border-yellow-700',activeBg:'bg-yellow-100 dark:bg-yellow-800/40', it:'Pancake' },
}

export function RecipeCalculator() {
  const [targetKg, setTargetKg] = useState(2)
  const [selectedId, setSelectedId] = useState(recipes[0].id)
  const selected = recipes.find(r => r.id === selectedId) || recipes[0]

  return (
    <div className="space-y-6">
      <div>
        <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-1">Calcolatore ricette</p>
        <h1 className="text-3xl font-serif font-bold mb-1">מחשבון מתכונים</h1>
        <p className="text-espresso-400 dark:text-espresso-300 font-sans text-sm">
          הזן כמות ק"ג — תקבל את המרכיבים המדויקים לפי מתכוני הבית
        </p>
      </div>

      {/* Recipe picker */}
      <div>
        <p className="section-eyebrow">בחר בצק</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.map(recipe => {
            const vis = recipeVisual[recipe.id] || {}
            const isActive = selectedId === recipe.id
            return (
              <button key={recipe.id} onClick={() => setSelectedId(recipe.id)}
                className={`text-right p-6 rounded-2xl border-2 transition-all duration-200 ${
                  isActive
                    ? `${vis.border} ${vis.activeBg}`
                    : 'border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 hover:border-bisque'
                }`}
                style={isActive ? {boxShadow:'0 4px 20px rgba(90,60,30,0.10)'} : {}}>
                <div className="text-4xl mb-3">{vis.emoji}</div>
                <p className="font-sans text-xs italic text-terra-500 dark:text-terra-300 mb-0.5">{vis.it}</p>
                <p className="font-serif font-bold text-lg text-espresso-800 dark:text-espresso-50 mb-1">{recipe.name}</p>
                <p className="text-xs text-espresso-400 dark:text-espresso-300 font-sans mb-3">{recipe.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="tag">{recipe.ingredients.length} מרכיבים</span>
                  {recipe.restTime > 0 && <span className="tag">מנוחה {recipe.restTime} דק׳</span>}
                </div>
                {isActive && <div className="mt-4 h-0.5 w-10 rounded-full bg-terra-400" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Amount control */}
      <div className="card">
        <p className="section-eyebrow">כמות רצויה</p>
        <div className="flex items-center gap-5">
          <input type="range" min="0.5" max="20" step="0.5" value={targetKg}
            onChange={e => setTargetKg(parseFloat(e.target.value))}
            className="flex-1" />
          <div className="flex items-baseline gap-2">
            <input type="number" min="0.1" step="0.1" value={targetKg}
              onChange={e => setTargetKg(parseFloat(e.target.value) || 0)}
              className="input-field w-24 text-center text-2xl font-serif py-2" />
            <span className="text-espresso-400 font-sans font-medium">ק"ג</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {[1,2,3,5,10].map(v => (
            <button key={v} onClick={() => setTargetKg(v)}
              className={`px-4 py-1.5 rounded-xl text-sm font-sans font-medium transition ${
                targetKg === v
                  ? 'bg-terra-400 text-white'
                  : 'bg-linen dark:bg-espresso-700 text-espresso-500 dark:text-espresso-200 hover:bg-canvas border border-silk dark:border-espresso-600'
              }`}>
              {v} ק"ג
            </button>
          ))}
        </div>
      </div>

      <RecipeCard recipe={selected} targetKg={targetKg} />
    </div>
  )
}
