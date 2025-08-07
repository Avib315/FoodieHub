import React from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import RecipesDisplay from '../../component/RecipeDisplay';
import HeaderTitle from '../../component/HeaderTitle';

export default function SavedRecipesPage() {


  const { data, loading } = useApiRequest({ url: "/savedRecipe/getAll", defaultValue: [], method: "GET" })

  return (
       <>

      <HeaderTitle title="מתכונים שאהבתי" />
    <RecipesDisplay pageType="saved" data={data}/> 
       </>
  )
}