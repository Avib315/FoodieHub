import React, { useEffect, useState } from 'react'
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai'
import useApiRequest from '../../services/useApiRequest'
import RecipesDisplay from '../../component/RecipeDisplay'
import HeaderTitle from '../../component/HeaderTitle'
import useUserStore from '../../store/userStore'

export default function RecipesPage() {
  const { data, setData, loading } = useApiRequest({ url: "/main", defaultValue: [], method: "GET" })
  useEffect(() => {
    useUserStore.getState().setUser({ ...data?.user, notification: data?.notification })
  }, [data?.length])


  return (
    <>
      <HeaderTitle title="מתכוני הקהילה" />
      <RecipesDisplay data={data?.recipes} loading={loading} setData={setData} />
    </>
  )
}