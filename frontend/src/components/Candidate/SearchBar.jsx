import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { searchResult } from '../../redux/candidateSlice'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const debounceTimer = useRef(null)
  const dispatch = useDispatch()

  const results = useSelector((state) => state.candidate.results)
  const loading = useSelector((state) => state.candidate.loading)
  const error = useSelector((state) => state.candidate.error)

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const clearSearch = () => {
    setQuery('')
    dispatch(searchResult({ searchQuery: '' }))
  }

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (query.trim() === '') {
      dispatch(searchResult({ searchQuery: '' }))
      return
    }

    debounceTimer.current = setTimeout(() => {
      dispatch(searchResult({ searchQuery: query}))
    }, 500)

    return () => clearTimeout(debounceTimer.current)
  }, [query, dispatch])

  return (
    <div className="relative flex-1">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Search rooms, interviewers, or topics..."
          value={query}
          onChange={handleInputChange}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white text-gray-900 placeholder-gray-500
                     transition-all duration-200 ease-in-out
                     hover:border-gray-400 focus:outline-none
                     text-sm font-medium"
        />

        {/* Clear (X) Icon */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center
                       text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Render Results */}
      {query.trim() !== '' && (
        <div className="mt-4">
          {loading && <p className="text-sm text-blue-500">Searching...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {results?.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {results.map((item, index) => (
                <li
                  key={item.roomId || index}
                  className="p-2 border border-gray-200 rounded-md bg-white shadow-sm"
                >
                  <p className="font-medium text-gray-800">{item.room.name}</p>
                  <p className="text-xs text-gray-500">Room ID: {item.room.roomId}</p>
                </li>
              ))}
            </ul>
          ) : (
            !loading && (
              <p className="text-sm text-gray-500 mt-2">No results found</p>
            )
          )}
        </div>
      )}
    </div>
  )
}
