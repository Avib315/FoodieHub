import React, { useState } from 'react'
import './style.scss'
import RecipeCard from '../../component/RecipeCard'
import SearchBar from '../../component/SerchBar'
import DropDown from '../../component/DropDown'
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai'
import NavBar from '../../component/NavBar'
import useApiRequest from '../../services/useApiRequest'
import axiosRequest from '../../services/axiosRequest'
import { Link } from 'react-router-dom'
import RecipesDisplay from '../../component/RecipeDisplay'
import HeaderTitle from '../../component/HeaderTitle'
import useUserStore from '../../store/userStore'

export default function RecipesPage() {
  const { data , setData } = useApiRequest({ url: "/main", defaultValue: [], method: "GET" })
  useUserStore.getState().setUser(data.user)
  
  return (
    <>
      <HeaderTitle title="מתכוני הקהילה" />
      <RecipesDisplay data={data?.recipes} setData={setData} />
    </>
  )
}