import React, { useEffect, useState } from 'react'
import './style.scss'
import useApiRequest from '../../services/useApiRequest'
import RecipesDisplay from '../../component/RecipeDisplay'
import HeaderTitle from '../../component/HeaderTitle'
import useUserStore from '../../store/userStore'

export default function MyRecipesPage() {
  const { data , setData } = useApiRequest({ url: "/recipe/myRecipes", defaultValue: [], method: "GET" })
    useEffect(()=>{

    },[])

  return (
    <>
      <HeaderTitle title="מתכונים שלי" />
      <RecipesDisplay data={data} isMyRecipes={true}  addSaveBtn={false} setData={setData} />
    </>
  )
}