import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className="relative flex-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search rooms, interviewers, or topics..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white text-gray-900 placeholder-gray-500
                     transition-all duration-200 ease-in-out
                     hover:border-gray-400 focus:outline-none
                     text-sm font-medium"
        />
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
    </div>
  )
}