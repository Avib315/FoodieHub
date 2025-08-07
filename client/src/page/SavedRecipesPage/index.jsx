import React from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import useAxiosRequest from '../../services/useApiRequest';
import axiosRequest from '../../services/axiosRequest';
import RecipesDisplay from '../../component/RecipeDisplay';
import HeaderTitle from '../../component/HeaderTitle';
import useApiRequest from '../../services/useApiRequest';

export default function SavedRecipesPage() {


  const { data, setData,loading } = useApiRequest({ url: "/savedRecipe/getAll", defaultValue: [], method: "GET" })
  console.log("SavedRecipesPage data:", data);
  const unArrayData = data.map(recipe => {
    return {
      ...recipe[0],
    };
  });
  return (
       <>

      <HeaderTitle title="מתכונים שאהבתי" />
    <RecipesDisplay pageType="saved" setData={setData} data={unArrayData}/> 
       </>
  )
}