import { DishImage } from '../../components/ui/DishPlaceholder.jsx'
import { Icons } from '../../components/ui/Icons.jsx'

export function DishCard({ dish, onSelect }) {
  return (
    <button
      onClick={() => onSelect(dish)}
      className="card-hover text-right overflow-hidden p-0 group"
    >
      <DishImage dish={dish} className="aspect-[4/3] w-full" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-lg font-serif font-bold group-hover:text-gold-700 dark:group-hover:text-gold-200 transition">
              {dish.name}
            </h3>
            <p className="text-xs text-charcoal-500 dark:text-charcoal-200">{dish.subtitle}</p>
          </div>
          <div className="bg-gold-50 dark:bg-gold-800/30 text-gold-700 dark:text-gold-200 px-2.5 py-1 rounded-md text-sm font-semibold">
            ₪{dish.price}
          </div>
        </div>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-200 line-clamp-2 mb-3">
          {dish.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-charcoal-500 dark:text-charcoal-200">
          <span className="flex items-center gap-1">
            <Icons.Clock className="w-3.5 h-3.5" />
            {dish.prepTime} דק׳
          </span>
          <span>·</span>
          <span>{dish.layers.length} שלבי הגשה</span>
        </div>
      </div>
    </button>
  )
}
