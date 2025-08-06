import React from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';

export default function SavedRecipesPage() {

   // מה שקורל עשתה ------------------------------------- 
  const { data, loading } = useAxiosRequest({
    url: '/savedRecipe/getAll', 
    method: 'get',
    defaultValue: []
  });

  async function addSaveRecipe() {
      const body =  {recipeId: "6892737909aaf0aab630d90b"} 
      const res = await axiosRequest({ url: "/savedRecipe/add", method: "POST", body: body }) 
      console.log(res)
    }

  async function removeSaveRecipe() {
      const res = await axiosRequest({ url: "/savedRecipe/remove/:recipeId", method: "DELETE"}) 
      console.log(res)
    }
 // מה שקורל עשתה ------------------------------------- 


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