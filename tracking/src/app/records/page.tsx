'use client'
import { useState, useEffect } from 'react'
import { getAllCruds, getRecordsByType } from '@/lib/actions/plumberActions'
import { format } from 'date-fns'

interface TestRecord {
  _id: string;
  projectName: string;
  locationAddress: string;
  technicianName: string;
  floorName: string;
  recordType: 'start' | 'end';
  date: string;
  time: string;
  readingPressure: number;
  pipingImageUrl?: string;
  createdAt: string;
}

export default function RecordDetails() {
  const [records, setRecords] = useState<TestRecord[]>([])
  const [filterType, setFilterType] = useState<'all' | 'start' | 'end'>('all')

  useEffect(() => {
    fetchRecords()
  }, [filterType])

  const fetchRecords = async () => {
    try {
      let response;
      if (filterType === 'all') {
        response = await getAllCruds()
      } else {
        response = await getRecordsByType(filterType)
      }

      if (response?.success && response?.cruds) {
        setRecords(response.cruds.map((crud: any) => ({
          _id: String(crud._id),
          projectName: crud.projectName || 'N/A',
          locationAddress: crud.locationAddress || 'N/A',
          technicianName: crud.technicianName || 'N/A',
          floorName: crud.floorName || 'N/A',
          recordType: crud.recordType || 'start',
          date: crud.date || '',
          time: crud.time || '',
          readingPressure: crud.readingPressure || 0,
          pipingImageUrl: crud.pipingImageUrl || '',
          createdAt: crud.createdAt || ''
        })))
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a')
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0718] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#150D29] p-6 rounded-xl border border-[#4A2189]">
          <h2 className="text-3xl font-bold text-white">Pressure Test Records</h2>
          <div className="flex items-center gap-4">
            <label className="text-white text-sm">Filter by:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'start' | 'end')}
              className="p-2.5 rounded-lg bg-[#0D0718] text-white border border-[#4A2189] hover:border-[#8540EC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8540EC]"
            >
              <option value="all">All Records</option>
              <option value="start">Start Records</option>
              <option value="end">End Records</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#150D29] p-6 rounded-xl border border-[#4A2189] hover:border-[#8540EC] transition-all">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Records</h3>
            <p className="text-3xl font-bold text-[#8540EC]">{records.length}</p>
          </div>
          <div className="bg-[#150D29] p-6 rounded-xl border border-[#4A2189] hover:border-[#8540EC] transition-all">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Start Records</h3>
            <p className="text-3xl font-bold text-green-500">
              {records.filter(r => r.recordType === 'start').length}
            </p>
          </div>
          <div className="bg-[#150D29] p-6 rounded-xl border border-[#4A2189] hover:border-[#8540EC] transition-all">
            <h3 className="text-lg font-medium text-gray-300 mb-2">End Records</h3>
            <p className="text-3xl font-bold text-blue-500">
              {records.filter(r => r.recordType === 'end').length}
            </p>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <div 
              key={record._id} 
              className="bg-[#150D29] rounded-xl border border-[#4A2189] hover:border-[#8540EC] transition-all overflow-hidden"
            >
              {/* Image Section with Click to View */}
              {record.pipingImageUrl && record.pipingImageUrl.trim() !== "" ? (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={record.pipingImageUrl} 
                    alt="Piping" 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => window.open(record.pipingImageUrl, '_blank')}
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    record.recordType === 'start' ? 'bg-green-600' : 'bg-blue-600'
                  }`}>
                    {record.recordType === 'start' ? 'Start' : 'End'}
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center bg-gray-700 text-gray-400">
                  No Image Available
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">{record.projectName}</h3>
                <p className="text-gray-300">Location: {record.locationAddress}</p>
                <p className="text-gray-300">Technician: {record.technicianName}</p>
                <p className="text-gray-300">Floor: <span className="text-[#8540EC]">{record.floorName}</span></p>

                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="text-white">{formatDate(record.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pressure:</span>
                    <span className="text-white font-medium">{record.readingPressure} PSI</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#4A2189] text-sm text-gray-400">
                  Created: {formatDateTime(record.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No records found</p>
          </div>
        )}
      </div>
    </div>
  )
}

