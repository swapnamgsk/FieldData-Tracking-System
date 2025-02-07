// 'use client'

// import { useState, useEffect } from 'react'
// import { format } from 'date-fns'
// import { createCrud, getAllCruds, getRecordsByType } from '@/lib/actions/plumberActions'

// interface TestRecord {
//   _id: string
//   technicianName: string
//   floorName: string
//   recordType: 'start' | 'end'
//   date: string
//   time: string
//   readingPressure: number
//   pipingImageUrl: string
//   createdAt: string
// }

// export default function Page() {
//   const [formData, setFormData] = useState({
//     technicianName: '',
//     floorName: '',
//     recordType: 'start' as 'start' | 'end',
//     date: format(new Date(), 'yyyy-MM-dd'),
//     time: format(new Date(), 'hh:mm a'),
//     readingPressure: '',
//     pipingImageUrl: ''
//   })
//   const [records, setRecords] = useState<TestRecord[]>([])
//   const [message, setMessage] = useState('')
//   const [filterType, setFilterType] = useState<'all' | 'start' | 'end'>('all')

//   // Update time every second with AM/PM
//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date()
//       setFormData(prev => ({
//         ...prev,
//         time: format(now, 'hh:mm a'),
//         date: format(now, 'yyyy-MM-dd')
//       }))
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   useEffect(() => {
//     fetchRecords()
//   }, [filterType])

//   const fetchRecords = async () => {
//     let response;
//     if (filterType === 'all') {
//       response = await getAllCruds()
//     } else {
//       response = await getRecordsByType(filterType)
//     }

//     if (response.success && response.cruds) {
//       setRecords(response.cruds.map((crud: any) => ({
//         _id: String(crud._id),
//         technicianName: crud.technicianName || '',
//         floorName: crud.floorName || '',
//         recordType: crud.recordType || 'start',
//         date: crud.date || '',
//         time: crud.time || '',
//         readingPressure: crud.readingPressure || 0,
//         pipingImageUrl: crud.pipingImageUrl || '',
//         createdAt: crud.createdAt || ''
//       })))
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const now = new Date()
//     const currentDate = format(now, 'yyyy-MM-dd')
//     const currentTime = format(now, 'hh:mm a')

//     const response = await createCrud(
//       formData.technicianName,
//       formData.floorName,
//       formData.recordType,
//       currentDate,
//       currentTime,
//       Number(formData.readingPressure),
//       formData.pipingImageUrl
//     )

//     if (response.success) {
//       setMessage(`✅ ${formData.recordType.toUpperCase()} record created at ${currentTime}`)
//       setFormData(prev => ({
//         technicianName: '',
//         floorName: '',
//         recordType: prev.recordType,
//         date: format(new Date(), 'yyyy-MM-dd'),
//         time: format(new Date(), 'hh:mm a'),
//         readingPressure: '',
//         pipingImageUrl: ''
//       }))
//       fetchRecords()
//     } else {
//       setMessage('❌ Failed to create record')
//     }
//   }

//   const handleRecordTypeChange = (type: 'start' | 'end') => {
//     const now = new Date()
//     setFormData(prev => ({
//       ...prev,
//       recordType: type,
//       time: format(now, 'hh:mm a'),
//       date: format(now, 'yyyy-MM-dd')
//     }))
//   }

//   // Add this helper function at the top of your component
//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString)
//       return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'MMM dd, yyyy')
//     } catch {
//       return 'Invalid Date'
//     }
//   }

//   // Add this helper function for timestamp formatting
//   const formatTimestamp = (dateString: string) => {
//     try {
//       const date = new Date(dateString)
//       return isNaN(date.getTime()) ? 'Invalid Date' : format(date, 'MMM dd, yyyy hh:mm a')
//     } catch {
//       return 'Invalid Date'
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0D0718] p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-white text-center">
//           Pressure Test Records
//         </h1>
        
//         {/* Left side - Form Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <div className="space-y-6">
//             <div className="bg-[#150D29] p-6 rounded-lg shadow-xl border border-[#4A2189]">
//               <h2 className="text-2xl font-semibold mb-6 text-white">Create New Record</h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Technician Name"
//                     value={formData.technicianName}
//                     onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
//                     className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
//                     required
//                   />
//                   <input
//                     type="text"
//                     placeholder="Floor Name"
//                     value={formData.floorName}
//                     onChange={(e) => setFormData({...formData, floorName: e.target.value})}
//                     className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
//                     required
//                   />
                  
//                   <div className="flex gap-4 p-3 border border-[#4A2189] rounded bg-[#0D0718]">
//                     <label className="flex items-center text-white">
//                       <input
//                         type="radio"
//                         value="start"
//                         checked={formData.recordType === 'start'}
//                         onChange={() => handleRecordTypeChange('start')}
//                         className="mr-2 accent-[#8540EC]"
//                       />
//                       Start Record
//                     </label>
//                     <label className="flex items-center text-white">
//                       <input
//                         type="radio"
//                         value="end"
//                         checked={formData.recordType === 'end'}
//                         onChange={() => handleRecordTypeChange('end')}
//                         className="mr-2 accent-[#8540EC]"
//                       />
//                       End Record
//                     </label>
//                   </div>

//                   <div className="p-4 rounded bg-[#4A2189] text-white">
//                     <p className="text-sm font-medium">
//                       Current Date: {formData.date}
//                     </p>
//                     <p className="text-sm font-medium">
//                       Current Time: {formData.time}
//                     </p>
//                   </div>

//                   <input
//                     type="number"
//                     placeholder="Reading Pressure (PSI)"
//                     value={formData.readingPressure}
//                     onChange={(e) => setFormData({...formData, readingPressure: e.target.value})}
//                     className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
//                     required
//                   />

//                   <input
//                     type="text"
//                     placeholder="Piping Image URL"
//                     value={formData.pipingImageUrl}
//                     onChange={(e) => setFormData({...formData, pipingImageUrl: e.target.value})}
//                     className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full p-3 bg-[#8540EC] text-white rounded hover:bg-[#4A2189] transition-colors"
//                 >
//                   Save Record
//                 </button>
//               </form>
//             </div>

//             {message && (
//               <div className="p-4 text-center rounded-lg bg-[#150D29] border border-[#4A2189] text-white">
//                 {message}
//               </div>
//             )}
//           </div>

//           {/* Right side - Results Section */}
//           <div className="space-y-6">
//             <div className="bg-[#150D29] p-6 rounded-lg shadow-xl border border-[#4A2189]">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-white">Records</h2>
//                 <select
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value as 'all' | 'start' | 'end')}
//                   className="p-2 rounded bg-[#0D0718] text-white border border-[#4A2189]"
//                 >
//                   <option value="all">All Records</option>
//                   <option value="start">Start Records</option>
//                   <option value="end">End Records</option>
//                 </select>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-[#4A2189] text-white">
//                     <tr>
//                       <th className="p-3 text-left">Details</th>
//                       <th className="p-3 text-left">Values</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-white">
//                     {records.map((record) => (
//                       <tr key={record._id} className="border-t border-[#4A2189]">
//                         <td colSpan={2} className="p-4 space-y-2">
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Technician:</span>
//                             <span>{record.technicianName}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Floor:</span>
//                             <span>{record.floorName}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Type:</span>
//                             <span className={`px-2 py-1 rounded ${
//                               record.recordType === 'start' ? 'bg-green-600' : 'bg-blue-600'
//                             }`}>
//                               {record.recordType === 'start' ? 'Start' : 'End'}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Date:</span>
//                             <span>{formatDate(record.date)}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Time:</span>
//                             <span>{record.time || 'N/A'}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Pressure:</span>
//                             <span>{record.readingPressure} PSI</span>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <span className="font-semibold">Image:</span>
//                             {record.pipingImageUrl && (
//                               <img 
//                                 src={record.pipingImageUrl} 
//                                 alt="Piping" 
//                                 className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
//                                 onClick={() => window.open(record.pipingImageUrl, '_blank')}
//                               />
//                             )}
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Created:</span>
//                             <span>{formatTimestamp(record.createdAt)}</span>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div className="bg-[#150D29] p-4 rounded-lg shadow border border-[#4A2189]">
//                 <h3 className="text-lg font-medium text-white">Total</h3>
//                 <p className="text-2xl font-bold text-[#8540EC]">{records.length}</p>
//               </div>
//               <div className="bg-[#150D29] p-4 rounded-lg shadow border border-[#4A2189]">
//                 <h3 className="text-lg font-medium text-white">Start</h3>
//                 <p className="text-2xl font-bold text-green-500">
//                   {records.filter(r => r.recordType === 'start').length}
//                 </p>
//               </div>
//               <div className="bg-[#150D29] p-4 rounded-lg shadow border border-[#4A2189]">
//                 <h3 className="text-lg font-medium text-white">End</h3>
//                 <p className="text-2xl font-bold text-blue-500">
//                   {records.filter(r => r.recordType === 'end').length}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createCrud } from '@/lib/actions/plumberActions'

export default function PostingForm({ onRecordCreated }: { onRecordCreated: () => void }) {
  const [formData, setFormData] = useState({
    projectName: '',
    locationAddress: '',
    technicianName: '',
    floorName: '',
    recordType: 'start' as 'start' | 'end',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'hh:mm a'),
    readingPressure: ''
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setFormData(prev => ({
        ...prev,
        time: format(now, 'hh:mm a'),
        date: format(now, 'yyyy-MM-dd')
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)

      // Generate a preview URL
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const now = new Date()
    const currentDate = format(now, 'yyyy-MM-dd')
    const currentTime = format(now, 'hh:mm a')

    // Ensure a file is selected
    if (!selectedFile) {
      setMessage('❌ Please select an image file.')
      return
    }

    // Upload image (Implement image upload logic, e.g., to Firebase, Cloudinary, or S3)
    const formDataToSend = new FormData()
    formDataToSend.append('image', selectedFile)

    // Simulated API call to upload image and get URL (Replace with actual API)
    const uploadedImageUrl = 'https://example.com/uploaded-image.jpg'

    // Send form data
    const response = await createCrud(
      formData.projectName,
      formData.locationAddress,
      formData.technicianName,
      formData.floorName,
      formData.recordType,
      currentDate,
      currentTime,
      Number(formData.readingPressure),
      uploadedImageUrl // Use the actual uploaded image URL
    )

    if (response.success) {
      setMessage(`✅ ${formData.recordType.toUpperCase()} record created at ${currentTime}`)
      setFormData(prev => ({
        projectName: '',
        locationAddress: '',
        technicianName: '',
        floorName: '',
        recordType: prev.recordType,
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'hh:mm a'),
        readingPressure: ''
      }))
      setSelectedFile(null)
      setPreviewImage(null)
      onRecordCreated()
    } else {
      setMessage('❌ Failed to create record')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#150D29] p-6 rounded-lg shadow-xl border border-[#4A2189]">
        <h2 className="text-2xl font-semibold mb-6 text-white">Create New Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Location Address"
              value={formData.locationAddress}
              onChange={(e) => setFormData({...formData, locationAddress: e.target.value})}
              className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Technician Name"
              value={formData.technicianName}
              onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
              className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Floor Name"
              value={formData.floorName}
              onChange={(e) => setFormData({...formData, floorName: e.target.value})}
              className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
              required
            />

            <div className="flex gap-4 p-3 border border-[#4A2189] rounded bg-[#0D0718]">
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  value="start"
                  checked={formData.recordType === 'start'}
                  onChange={() => setFormData({...formData, recordType: 'start'})}
                  className="mr-2 accent-[#8540EC]"
                />
                Start Record
              </label>
              <label className="flex items-center text-white">
                <input
                  type="radio"
                  value="end"
                  checked={formData.recordType === 'end'}
                  onChange={() => setFormData({...formData, recordType: 'end'})}
                  className="mr-2 accent-[#8540EC]"
                />
                End Record
              </label>
            </div>

            <input
              type="number"
              placeholder="Reading Pressure (PSI)"
              value={formData.readingPressure}
              onChange={(e) => setFormData({...formData, readingPressure: e.target.value})}
              className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white placeholder-gray-400"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-[#4A2189] rounded bg-[#0D0718] text-white"
              required
            />

            {previewImage && (
              <div className="mt-4">
                <p className="text-white text-sm">Image Preview:</p>
                <img src={previewImage} alt="Preview" className="mt-2 rounded-lg max-h-40" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#8540EC] text-white rounded hover:bg-[#4A2189] transition-colors"
          >
            Save Record
          </button>
        </form>
      </div>

      {message && (
        <div className="p-4 text-center rounded-lg bg-[#150D29] border border-[#4A2189] text-white">
          {message}
        </div>
      )}
    </div>
  )
}
