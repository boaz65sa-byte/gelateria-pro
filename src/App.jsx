import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { Dashboard } from './modules/Dashboard/Dashboard.jsx'
import { RecipeCalculator } from './modules/RecipeCalculator/RecipeCalculator.jsx'
import { CustomRecipe } from './modules/CustomRecipe/CustomRecipe.jsx'
import { Inventory } from './modules/Inventory/Inventory.jsx'
import { Equipment } from './modules/Equipment/Equipment.jsx'
import { PlatingGuide } from './modules/PlatingGuide/PlatingGuide.jsx'
import { Shifts } from './modules/Shifts/Shifts.jsx'
import { SweetMenu } from './modules/SweetMenu/SweetMenu.jsx'
import { Settings } from './modules/Settings/Settings.jsx'
import { PrintableManual } from './pages/PrintableManual.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index            element={<Dashboard />} />
        <Route path="shifts"    element={<Shifts />} />
        <Route path="menu"      element={<SweetMenu />} />
        <Route path="plating"   element={<PlatingGuide />} />
        <Route path="recipes"   element={<RecipeCalculator />} />
        <Route path="custom"    element={<CustomRecipe />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="settings"  element={<Settings />} />
        <Route path="print"     element={<PrintableManual />} />
      </Route>
    </Routes>
  )
}
