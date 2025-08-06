import React from 'react'
import Table from '../../component/Table'
const recipeColumns = [
  { title: 'שם המתכון', field: 'name', typeof: 'string' },
  { title: 'קטגוריה', field: 'category', typeof: 'string' },
  { title: 'סטטוס', field: 'status', typeof: 'badge' },
  { title: 'קישור למתכון', field: 'link', typeof: 'link' },
];
const recipeData = [
  {
    name: 'פיצה מרגריטה',
    category: 'main',
    status: 'pending',
    link: 'https://example.com/recipe/margherita'
  },
];

export default function RecipesPanel() {
  return (
    <div className='recipes-panel'>
        <Table tableColumns={recipeColumns} tableData={recipeData}/>
    </div>
  )
}
