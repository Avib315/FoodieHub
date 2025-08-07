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

export default function RecipesPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const { data, loading } = useApiRequest({ url: "/recipe/getAll", defaultValue: [], method: "GET" })

  const handleFilterSelect = (option) => {
    console.log(option)
    setActiveFilters(prev => prev + 1)
  }

  const clearAllFilters = () => {
    setActiveFilters(0)
  }

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false)
  }

  return (
    <>
   <RecipesDisplay pageType="home" /> 
    </>
  )
}