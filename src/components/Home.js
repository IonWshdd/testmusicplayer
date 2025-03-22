import React from 'react'
import { Link } from 'react-router-dom'
import TotalSongsScript from './TotalSongsScript.js'

const Home = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-800 text-white'>
            <div className='text-xl justify-center text-center lg:text-center'>Welcome to Kanye West Music Player, the best music player for Unreleased Kanye West</div>
            <div className='justify-center'><Link to="/bully" className='text-2xl font-bold underline'>Listen Now</Link></div>
            <div className='absolute bottom-8 left-0 p-4'>
                <TotalSongsScript />
            </div>
        </div>
    )
}

export default Home
