import React, { useState } from 'react'
import './style.scss'
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai'
import useApiRequest from '../../services/useApiRequest'
import RecipesDisplay from '../../component/RecipeDisplay'
import HeaderTitle from '../../component/HeaderTitle'
import useUserStore from '../../store/userStore'

export default function RecipesPage() {
  const { data , setData } = useApiRequest({ url: "/main", defaultValue: [], method: "GET" })
  useUserStore.getState().setUser({...data?.user , notification:data?.notification})

  return (
    <>
      <HeaderTitle title="מתכוני הקהילה" />
      <RecipesDisplay data={data?.recipes} setData={setData} />
    </>
  )
}