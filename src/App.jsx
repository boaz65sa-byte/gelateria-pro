import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { Dashboard } from './modules/Dashboard/Dashboard.jsx'
import { RecipeCalculator } from './modules/RecipeCalculator/RecipeCalculator.jsx'
import { CustomRecipe } from './modules/CustomRecipe/CustomRecipe.jsx'
import { Inventory } from './modules/Inventory/Inventory.jsx'
import { PlatingGuide } from './modules/PlatingGuide/PlatingGuide.jsx'
import { Shifts } from './modules/Shifts/Shifts.jsx'
import { PrintableManual } from './pages/PrintableManual.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index          element={<Dashboard />} />
        <Route path="recipes" element={<RecipeCalculator />} />
        <Route path="custom"  element={<CustomRecipe />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="plating"   element={<PlatingGuide />} />
        <Route path="shifts"    element={<Shifts />} />
        <Route path="print"     element={<PrintableManual />} />
      </Route>
    </Routes>
  )
}
