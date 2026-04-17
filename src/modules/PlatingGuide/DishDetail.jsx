import { DishImage } from '../../components/ui/DishPlaceholder.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

export function DishDetail({ dish, onBack }) {
  return (
    <div className="space-y-6">
      <div className="no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-charcoal-500 dark:text-charcoal-200 hover:text-gold-700 dark:hover:text-gold-200 transition"
        >
          <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
          חזור לגלריה
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DishImage dish={dish} className="aspect-[4/3] w-full rounded-xl" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MetaTile label="מחיר" value={`₪${dish.price}`} />
            <MetaTile label="זמן הכנה" value={`${dish.prepTime} דק׳`} />
            <MetaTile label="שלבים" value={dish.layers.length} />
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-1">{dish.name}</h1>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-200">{dish.subtitle}</p>
            </div>
            <Button variant="secondary" onClick={() => window.print()} className="no-print">
              <Icons.Print className="w-4 h-4" />
              הדפס
            </Button>
          </div>

          <p className="text-charcoal-700 dark:text-charcoal-50 mb-6 leading-relaxed">
            {dish.description}
          </p>

          <section className="mb-6">
            <h2 className="text-sm uppercase tracking-wider text-charcoal-500 dark:text-charcoal-200 mb-3 font-sans font-semibold">
              סדר הגשה
            </h2>
            <ol className="space-y-3">
              {dish.layers.map((layer) => (
                <li key={layer.order} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-400 text-charcoal-900 text-sm font-bold flex items-center justify-center">
                    {layer.order}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="font-medium text-sm">{layer.title}</p>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-200 mt-0.5">
                      {layer.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {dish.tips?.length > 0 && (
            <section>
              <h2 className="text-sm uppercase tracking-wider text-charcoal-500 dark:text-charcoal-200 mb-3 font-sans font-semibold">
                טיפים חשובים
              </h2>
              <ul className="space-y-2">
                {dish.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 p-3 bg-gold-50 dark:bg-gold-800/10 rounded-lg text-sm"
                  >
                    <span className="text-gold-700 dark:text-gold-200 font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-charcoal-700 dark:text-charcoal-50">{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function MetaTile({ label, value }) {
  return (
    <div className="bg-ivory dark:bg-charcoal-700 rounded-lg p-3 text-center">
      <p className="text-xs text-charcoal-500 dark:text-charcoal-200 mb-1">{label}</p>
      <p className="font-serif font-semibold">{value}</p>
    </div>
  )
}
