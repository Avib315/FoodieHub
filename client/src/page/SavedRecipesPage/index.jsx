import React from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import useAxiosRequest from '../../services/useApiRequest';

export default function SavedRecipesPage() {
  const { data, loading } = useAxiosRequest({
    url: '/recipe/getAll', 
    method: 'get',
    defaultValue: []
  });

  return (
    <div className='saved-recipes-page'>
      <header className='page-header'>
        <h1 className='page-title'>מתכונים שאהבתי</h1>
      </header>

      <main className='recipes-content'>
        {loading ? (
          <div className='loading-state'>
            <div className='loading-spinner'></div>
            <p>טוען מתכונים...</p>
          </div>
        ) : (
          <div className='recipes-grid'>
            {data && data.length > 0 ? (
              data.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            ) : (
              <div className='empty-state'>
                <p>עדיין לא שמרת מתכונים</p>
                <a href="/recipes" className='cta-button'>גלה מתכונים חדשים</a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}