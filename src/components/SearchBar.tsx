"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 

const SearchBar = ({ initialSearch }: { initialSearch?: string }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    router.push(`/tickets${query}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        className="border rounded p-2"
        placeholder="Search tickets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
