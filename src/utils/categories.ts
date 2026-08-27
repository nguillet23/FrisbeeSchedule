// category name -> Calendar.module.css local class key (category1..category7)
export const CATEGORY_CLASS_KEY: Record<string, string> = {
  Practice: 'category1',
  Meeting: 'category2',
  Tournament: 'category3',
  Scrimmage: 'category4',
  'Frisbee Friday': 'category5',
  'Chain Gang': 'category6',
  'Hang Out': 'category7',
}

// Same list admin.html hardcoded a second time for its category <select> —
// derived here instead so there's one source of truth for the 7 categories.
export const CATEGORIES = Object.keys(CATEGORY_CLASS_KEY)
