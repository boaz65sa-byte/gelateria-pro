import { useState } from 'react'
import { DishCard } from './DishCard.jsx'
import { DishDetail } from './DishDetail.jsx'
import { dishes } from '../../data/dishesData.js'

export function PlatingGuide() {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return <DishDetail dish={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-1">מדריך הגשה</h1>
        <p className="text-charcoal-500 dark:text-charcoal-200">
          סדר ההגשה הקפדני לכל מנה — לחץ על כרטיס לצפייה בפרטים
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onSelect={setSelected} />
        ))}
      </div>

      <div className="card bg-gold-50/30 dark:bg-gold-800/10 border border-gold-100 dark:border-gold-800/30">
        <h3 className="font-serif font-semibold mb-2">💡 טיפ למחליף תמונות</h3>
        <p className="text-sm text-charcoal-700 dark:text-charcoal-50 mb-2">
          כדי להחליף את התמונות המוצגות (במקום ה-SVG placeholders):
        </p>
        <ol className="text-sm space-y-1 list-decimal list-inside text-charcoal-500 dark:text-charcoal-200 mr-2">
          <li>שים את קבצי התמונות שלך בתיקייה <code className="bg-ivory dark:bg-charcoal-700 px-1.5 py-0.5 rounded text-xs">public/images/</code></li>
          <li>
            ערוך את <code className="bg-ivory dark:bg-charcoal-700 px-1.5 py-0.5 rounded text-xs">src/data/dishesData.js</code>
            {' '}ושנה את השדה <code className="bg-ivory dark:bg-charcoal-700 px-1.5 py-0.5 rounded text-xs">imagePath</code>
          </li>
          <li>גודל מומלץ: 800×600 פיקסלים, JPG/WebP, עד 200KB</li>
        </ol>
      </div>
    </div>
  )
}
