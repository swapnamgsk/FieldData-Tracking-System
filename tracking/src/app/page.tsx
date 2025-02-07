// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {createCrud, getAllCruds, deleteCrud } from "@/lib/actions/Useractions";

export default function CrudPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [cruds, setCruds] = useState<{ _id: string; name: string; description: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createCrud(name, description);
      if (response.success) {
        setMessage("✅ Entry created successfully!");
        setName(""); // Clear the form
        setDescription(""); // Clear the form
        fetchCruds(); // Reload the list
      } else {
        setMessage("❌ Failed to create entry");
      }
    } catch (error) {
      setMessage("❌ Error creating entry");
    }
  };

  const fetchCruds = async () => {
    const response = await getAllCruds();
    if (response.success && response.cruds) {
      setCruds(
        response.cruds.map((crud) => ({
          _id: crud._id?.toString() || String(crud._id) || '', // More robust ID conversion
          name: crud.name,
          description: crud.description,
        }))
      );
    } else {
      setCruds([]);
      setMessage("❌ Failed to load entries");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteCrud(id);
      if (response.success) {
        setMessage("✅ Entry deleted successfully!");
        fetchCruds(); // Refresh list
      } else {
        setMessage("❌ Failed to delete entry");
      }
    } catch (error) {
      setMessage("❌ Error deleting entry");
    }
  };

  // Add useEffect to load entries on component mount
  useEffect(() => {
    fetchCruds();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">CRUD Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full p-2 border rounded"
          required 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full p-2 border rounded"
          required 
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Entry
        </button>
      </form>

      <p className="my-4 text-center">{message}</p>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Entries:</h3>
          <button 
            onClick={fetchCruds}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Load Entries
          </button>
        </div>
        <ul className="space-y-2">
          {cruds.map((crud) => (
            <li key={crud._id} className="flex justify-between items-center p-2 border rounded">
              <span>{crud.name} - {crud.description}</span>
              <button 
                onClick={() => handleDelete(crud._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
