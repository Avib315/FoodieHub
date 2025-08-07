import React from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import RecipesDisplay from '../../component/RecipeDisplay';
import HeaderTitle from '../../component/HeaderTitle';

export default function SavedRecipesPage() {




  return (
       <>

      <HeaderTitle title="מתכונים שאהבתי" />
    <RecipesDisplay pageType="saved" /> 
       </>
  )
}