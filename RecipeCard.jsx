import { useState } from 'react'
import { DishCard } from './DishCard.jsx'
import { DishDetail } from './DishDetail.jsx'
import { dishes as defaultDishes } from '../../data/dishesData.js'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

const genId=()=>`dish-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

export function PlatingGuide() {
  const [dishes,setDishes]=useLocalStorage('gelateria-dishes',defaultDishes)
  const [selected,setSelected]=useState(null)

  const updateDish=updated=>setDishes(prev=>prev.map(d=>d.id===updated.id?updated:d))
  const deleteDish=id=>{if(window.confirm('למחוק את המנה?'))setDishes(prev=>prev.filter(d=>d.id!==id));setSelected(null)}
  const addDish=()=>{
    const d={id:genId(),name:'מנה חדשה',subtitle:'תת-כותרת',price:30,prepTime:5,imagePath:'',color:'gold',description:'תיאור המנה',layers:[{id:'l1',order:1,title:'שלב 1',detail:'פרטים'}],tips:[]}
    setDishes(prev=>[...prev,d]);setSelected(d)
  }

  if(selected){
    const live=dishes.find(d=>d.id===selected.id)||selected
    return(
      <DishDetail dish={live} onBack={()=>setSelected(null)}
        onDishChange={updated=>{updateDish(updated);setSelected(updated)}}/>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-0.5">Guida all'impiattamento</p>
          <h1 className="text-3xl font-serif font-bold mb-1">מדריך הגשה</h1>
          <p className="text-sm text-espresso-400 font-sans">לחץ על מנה לפרטים מלאים · לחץ על עריכה לשינוי</p>
        </div>
        <Button variant="primary" onClick={addDish}><Icons.Plus className="w-4 h-4"/> מנה חדשה</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dishes.map(dish=>(
          <div key={dish.id} className="relative group">
            <DishCard dish={dish} onSelect={setSelected}/>
            <button onClick={()=>deleteDish(dish.id)}
              className="absolute top-3 left-3 p-1.5 rounded-lg bg-white/80 dark:bg-espresso-800/80 text-espresso-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition shadow-sm">
              <Icons.Trash className="w-3.5 h-3.5"/>
            </button>
          </div>
        ))}
      </div>

      <div className="card bg-terra-50/40 dark:bg-terra-900/10 border border-terra-100 dark:border-terra-800/30">
        <p className="text-sm font-sans text-terra-700 dark:text-terra-300">
          💡 <strong>החלפת תמונות:</strong> שים קבצים ב-<code className="bg-white dark:bg-espresso-700 px-1.5 py-0.5 rounded text-xs">public/images/</code> ·
          ערוך <code className="bg-white dark:bg-espresso-700 px-1.5 py-0.5 rounded text-xs">src/data/dishesData.js</code> ושנה <code className="bg-white dark:bg-espresso-700 px-1.5 py-0.5 rounded text-xs">imagePath</code>
        </p>
      </div>
    </div>
  )
}
