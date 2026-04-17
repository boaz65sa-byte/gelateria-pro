# 🍨 Gelateria Pro

> אפליקציית ניהול תפעול מקצועית לגלטריה
> **bs-simple.com** · בועז סעדה — פתרונות יצירתיים

אפליקציית React מקצועית לניהול יומי של גלטריה: צ'קליסטים, חישוב מתכונים, ניהול מלאי, מדריך הגשה, והפקת PDF לספר תפעול מודפס.

---

## 🚀 התחלה מהירה

```bash
# התקנה
npm install

# הרצה בפיתוח (פותח http://localhost:5173)
npm run dev

# בניית גרסת ייצור
npm run build

# הצגת גרסת הייצור
npm run preview
```

דרישה: Node.js גרסה 18 ומעלה.

---

## 📂 מבנה הפרויקט

```
gelateria-pro/
├── index.html                     # HTML root + RTL
├── package.json                   # תלויות
├── vite.config.js                 # Vite config
├── tailwind.config.js             # Tailwind + צבעים מותאמים
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   └── images/                    # ← שים כאן תמונות למנות
└── src/
    ├── main.jsx                   # כניסה
    ├── App.jsx                    # Router
    ├── index.css                  # סגנונות גלובליים + RTL + print
    │
    ├── components/
    │   ├── Layout.jsx             # מעטפת (Sidebar + Header)
    │   ├── Sidebar.jsx            # ניווט צדדי
    │   └── ui/
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       ├── Icons.jsx          # כל האייקונים כ-SVG
    │       └── DishPlaceholder.jsx # SVG placeholders למנות
    │
    ├── modules/
    │   ├── Dashboard/
    │   │   ├── Dashboard.jsx      # עמוד הלוח הראשי
    │   │   └── Checklist.jsx      # צ'קליסט עם חותמות זמן
    │   ├── RecipeCalculator/
    │   │   ├── RecipeCalculator.jsx
    │   │   └── RecipeCard.jsx
    │   ├── Inventory/
    │   │   ├── Inventory.jsx      # רשימה ראשית
    │   │   ├── InventoryItem.jsx  # שורה בודדת עם +/-
    │   │   └── OrderForm.jsx      # טופס הזמנה אוטומטי
    │   └── PlatingGuide/
    │       ├── PlatingGuide.jsx   # גלריה
    │       ├── DishCard.jsx       # כרטיס בגלריה
    │       └── DishDetail.jsx     # עמוד פרטים
    │
    ├── pages/
    │   └── PrintableManual.jsx    # ספר המתכונים המלא להדפסה
    │
    ├── hooks/
    │   ├── useLocalStorage.js     # שמירה אוטומטית
    │   └── useTheme.js            # Dark/Light
    │
    ├── utils/
    │   └── dateFormat.js          # פורמט עברית
    │
    └── data/                      # 📝 כל מה שניתן לערוך כאן
        ├── recipes.js             # יחסי המרכיבים במתכונים
        ├── checklistData.js       # פריטי צ'קליסט פתיחה/סגירה
        ├── inventoryData.js       # מלאי ברירת מחדל + קטגוריות
        └── dishesData.js          # מנות, שכבות הגשה ותמונות
```

---

## ✏️ איך לערוך

### שינוי יחסי מתכונים

פתח את `src/data/recipes.js`. כל מתכון מכיל מערך `ingredients`:

```js
{
  name: 'קמח לבן',
  amount: 250,    // ← שנה את המספר הזה
  unit: 'g'
}
```

הערכים הם לכל 1 ק"ג בצק מוגמר. המערכת מחשבת אוטומטית פרופורציונלית.

**הוספת מתכון חדש:** הוסף אובייקט חדש למערך `recipes`. הוא יופיע אוטומטית בממשק.

### שינוי משימות בצ'קליסט

פתח את `src/data/checklistData.js`. הוסף/הסר/ערוך פריטים.
`critical: true` גורם למשימה להופיע עם כוכב אדום.

### שינוי מלאי ברירת מחדל

פתח את `src/data/inventoryData.js`. הערה: ברגע שהמשתמש משנה את המלאי, השינויים נשמרים ב-localStorage ועוקפים את ברירת המחדל. לאיפוס — כפתור "איפוס" בעמוד המלאי.

### החלפת תמונות המנות

1. שים קבצים ב-`public/images/` (למשל `my-waffle.jpg`)
2. ב-`src/data/dishesData.js` שנה את `imagePath: '/images/my-waffle.jpg'`

תמונה שלא נמצאת → אוטומטית מוצג SVG placeholder יפה במקומה.

---

## 🎨 ערכת נושא

- **Light (ברירת מחדל):** רקע קרם #FAFAF7, אקסנט זהב #C9A961
- **Dark:** רקע פחם כהה #0F0F0E, אותו זהב
- **כפתור** בראש הדף מחליף בין המצבים ושומר את הבחירה

שינוי הצבעים: `tailwind.config.js` → `colors.gold` / `colors.charcoal`.

---

## 🖨️ הדפסה ל-PDF

בעמוד "ספר מתכונים מודפס" (`/print`) יש כפתור "הדפס / שמור כ-PDF".
הכפתור מפעיל `window.print()`. בדפדפן שיופיע, בחר:

- **שמור כ-PDF** כדי לייצר קובץ להורדה
- **הדפסה ישירה** לדפוס פיזי

העיצוב מותאם לדף A4 עם מרווחים, דפדוף עמודים נכון, והסתרה אוטומטית של ה-Sidebar וכפתורים.

---

## 💾 שמירת נתונים

כל הנתונים נשמרים ב-`localStorage` של הדפדפן:

- `gelateria-theme` — מצב תצוגה
- `gelateria-inventory` — מלאי נוכחי
- `gelateria-opening-YYYY-MM-DD` — סימוני פתיחה ליום
- `gelateria-closing-YYYY-MM-DD` — סימוני סגירה ליום

**יתרון:** אין צורך בשרת או התחברות.
**מגבלה:** הנתונים שייכים למכשיר/דפדפן. ניקוי הדפדפן = איפוס.

רוצה לשדרג ל-multi-device? נוסיף Supabase (כמו ב-SwipeBid).

---

## 📱 התאמה לטאבלט ומובייל

- **מעל 1024px (דסקטופ):** Sidebar קבוע בצד ימין, תוכן רחב
- **מתחת ל-1024px (טאבלט/מובייל):** Sidebar נסגר ונפתח עם המבורגר
- **גריד אדפטיבי:** 3 עמודות בדסקטופ → 2 בטאבלט → 1 במובייל
- **מגע:** כל הכפתורים בגודל מינימלי של 44×44px

---

## 🛠️ סטאק טכנולוגי

| טכנולוגיה | גרסה | תפקיד |
|----------|------|-------|
| React | 18 | ליבה |
| Vite | 5 | Build + Dev server |
| TailwindCSS | 3 | סטיילינג |
| React Router | 6 | ניווט |
| localStorage | native | אחסון |

---

## 📞 תמיכה

**bs-simple.com** · בועז סעדה — פתרונות יצירתיים
boaz65sa@gmail.com

---

© 2026 Boaz Saada. All rights reserved.
