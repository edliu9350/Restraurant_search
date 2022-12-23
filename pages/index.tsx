import React, { useState } from 'react'
import Head from 'next/head'
import classNames from 'classnames'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  lastSearchUpdate,
  latestResultsUpdate,
  currentLocationUpdate,
  isLocationCustomUpdate,
} from '../features/appslice/appslice'
import type { RootState } from '../app/store'

import Navbar from '../components/Navbar'
import RoundedFullButton from '../components/RoundedFullButton'

import { DataResponse } from './api/search'
import { Business } from '../types/Business'

type SEARCH_STATE = 'INITIAL' | 'LOADING' | 'DONE'

export default function Home() {
  const [searchState, setSearchState] = useState<SEARCH_STATE>('INITIAL')
  const [errors, setErrors] = useState<string[]>([])
  const [resultsItems, setResultsItems] = useState<Business[]>([])

  const dispatch = useAppDispatch()
  const lastSearch = useAppSelector((state: RootState) => state.app.lastSearch)
  const currentLocation = useAppSelector(
    (state: RootState) => state.app.currentLocation
  )
  const isLocationCustom = useAppSelector(
    (state: RootState) => state.app.isLocationCustom
  )

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentLocation === '') {
      alert("You can't search without a location")
      return
    }

    if (lastSearch === '') {
      alert("You can't search without a term to search")
    }

    setErrors([])
    setSearchState('LOADING')

    try {
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'applicatoin/json',
        },
        body: JSON.stringify({ term: lastSearch, location: currentLocation }),
      })
      const { results, message } = (await searchResponse.json()) as DataResponse

      if (message === 'Location_NOT_FOUND' || message === 'NO_RESULTS') {
        if (!errors.includes(message)) {
          setErrors([...errors, message])
        }
      }

      setResultsItems(results)
      dispatch(latestResultsUpdate(results))
      setSearchState('DONE')
    } catch (error) {
      if (error instanceof Error) {
        setErrors([...errors, error.message])
      }
    }
  }

  return (
    <>
      <Head>
        <title>My Next App</title>
        <meta name="description" content="Search_Restaurant_Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        <section className="px-2 py-4 flex flex-col md:justify-center md:items-center gap-y-4">
          <div
            className={classNames(
              'flex flex-col transition-all duration-300',
              'mt-[10rem]'
            )}
          >
            <form onSubmit={handleSearch}>
              <label className="mb-2 font-medium sr-only dark:text-white">
                Search
              </label>
              <div className="relative md:w-[760px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 border-purple-dark border-2 transition-all rounded-t-[2.2rem] bg-gray-50 focus:ring-purple-lighest focus:border-purple-lighest dark:text-white dark:focus:ring-purple-lighest dark:focus:border-purple-lighest outline-none focus:shadow-custom dark:bg-[black]"
                  placeholder="Search for restaurants and more"
                  required
                  autoComplete="off"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(lastSearchUpdate(event.target.value))
                  }}
                  value={lastSearch}
                />
                <button
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-purple-dark hover:bg-purple-darkest focus:ring-4 focus:outline-none focus:ring-purple-light font-medium rounded-full px-4 py-2 dark:hover:bg-purple-darkest transition"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="flex items-center gap-x-3 md:gap-x-4 justify-end bg-purple-so-lighest md:w-[760px] rounded-b-[2.2rem] dark:bg-purple-dark">
              <p className="text-[1.1rem] dark:text-white">
                <span role={'img'}>📍</span> Location
              </p>
              <input
                type="text"
                className="w-48 md:w-auto p-3 pl-5 border-b-2 border-l-2 border-r-2 border-purple-dark text-[1.1rem] rounded-br-[2.2rem] focus:ring-purple-lighest focus:border-purple-lighest outline-none bg-white dark:bg-[black] transition"
                placeholder="City"
                value={currentLocation}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch(currentLocationUpdate(event.target.value))
                }}
              />
            </div>
          </div>
          <div className="text-center">
            <p className="dark:text-purple-lightest text-purple-dark text-[1.5rem] font-bold">
              <span role={'img'}>🔍</span> Loading...
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-3 md:w-[500px] text-center">
            <h1 className="text-2xl">🌍Where are you now? </h1>
            <p>
              <span role={'img'}>☝️</span> Allow access to your location if you
              want to use the city from where you are in the search. Or just
              write your city in{' '}
              <b>
                <span role={'img'}>📍</span> Location
              </b>
              .
            </p>
            <RoundedFullButton text="Allow location access" />
          </div>
          <div>Search Results</div>
        </section>
      </main>
    </>
  )
}
