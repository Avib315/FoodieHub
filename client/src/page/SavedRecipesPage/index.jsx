import React from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import useAxiosRequest from '../../services/useApiRequest';
export default function SavedRecipesPage() {
  const { data , loading } = useAxiosRequest({url: '/recipe/getAll', method: 'get',defaultValue:[] });
  return (
    <div className='saved-recipes-page'>
      {data && data.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
