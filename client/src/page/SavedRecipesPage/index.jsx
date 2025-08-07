import React from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import RecipesDisplay from '../../component/RecipeDisplay';

export default function SavedRecipesPage() {




  return (
       <>
      <header className='page-header'>
        <h1 className='page-title'>מתכונים שאהבתי</h1>
      </header>
    <RecipesDisplay pageType="saved" /> 
       </>
  )
}