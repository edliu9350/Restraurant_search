import React from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <>
      <Head>
        <title>My Next App</title>
        <meta name="description" content="Search_Restaurant_Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
      </main>
    </>
  )
}
