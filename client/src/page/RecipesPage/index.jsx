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

export default function RecipesPage() {

  return (
    <>
      <HeaderTitle title="מתכוני הקהילה" />
      <RecipesDisplay pageType="home" />
    </>
  )
}