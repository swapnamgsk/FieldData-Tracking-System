// "use client";

// import { useEffect, useState } from "react";
// import { getTestRecords } from "@/lib/actions/plumberActions";

// // ✅ Define the correct type for records
// type TestRecordType = {
//   _id: string;
//   projectName: string;
//   locationAddress: string;
//   technicianName: string;
//   date: string;
//   time: string;
//   readingPressure: number;
//   image?: string; // Optional image
//   recordType?: "start" | "end"; // ✅ Added optional "type" field
// };

// export default function RecordsPage() {
//   const [records, setRecords] = useState<TestRecordType[]>([]); // ✅ Type defined

//   useEffect(() => {
//     async function fetchRecords() {
//       const data = await getTestRecords();
//       setRecords(data); // ✅ No TypeScript error now
//     }
//     fetchRecords();
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         Test Records
//       </h1>

//       {records.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {records.map((record) => (
//             <div
//               key={record._id}
//               className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow"
//             >
//               <h2 className="text-xl font-semibold text-gray-900 mb-2">
//               Project name : {record.projectName}
//               </h2>
//               <p className="text-gray-600">
//                 📍Location : {record.locationAddress} | 👷Technician :{record.technicianName}
//               </p>
//               <p className="text-gray-500 mt-1">
//                 📅 Timings: {new Date(record.date).toLocaleDateString()} | ⏰ {record.time}
//               </p>
//               <p className="text-blue-600 font-medium mt-2">
//                 🔹 Pressure: {record.readingPressure} bar
//               </p>

//               {/* ✅ Fixed "type" error with optional chaining and fallback value */}
//               <p
//                 className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
//                   record.recordType === "start"
//                     ? "bg-green-100 text-green-800"
//                     : "bg-red-100 text-red-800"
//                 }`}
//               >
//                 Record: {(record.recordType ?? "UNKNOWN").toUpperCase()}
//               </p>

//               {/* Image Handling */}
//               {record.image && record.image.startsWith("data:image") ? (
//                 <div className="relative mt-4">
//                   <img
//                     src={record.image}
//                     alt={`Record ${record.projectName}`}
//                     className="w-full h-40 object-cover rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
//                     onClick={() => window.open(record.image, "_blank")}
//                   />
//                   <p className="text-xs text-center text-gray-500 mt-1">
//                     Click to enlarge
//                   </p>
//                 </div>
//               ) : (
//                 <div className="h-40 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg mt-4">
//                   No Image Available
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 text-lg mt-10">
//           ❌ No records found
//         </p>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { getTestRecords } from "@/lib/actions/plumberActions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ✅ Define the correct type for records
type TestRecordType = {
  _id: string;
  projectName: string;
  locationAddress: string;
  technicianName: string;
  date: string;
  time: string;
  readingPressure: number;
  image?: string; // Optional image
  recordType?: "start" | "end"; // ✅ Added optional "type" field
};

export default function RecordsPage() {
  const [records, setRecords] = useState<TestRecordType[]>([]); // ✅ Type defined

  useEffect(() => {
    async function fetchRecords() {
      const data = await getTestRecords();
      setRecords(data); // ✅ No TypeScript error now
    }
    fetchRecords();
  }, []);

  // ✅ Function to generate PDF for a selected record
  const generatePDF = async (recordId: string) => {
    const element = document.getElementById(`record-${recordId}`);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    pdf.text("Test Record Details", 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 180, 120);
    pdf.save(`record_${recordId}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Test Records
      </h1>

      {records.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <div
              key={record._id}
              id={`record-${record._id}`} // ✅ Add ID for reference
              className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Project name: {record.projectName}
              </h2>
              <p className="text-gray-600">
                📍 Location: {record.locationAddress} | 👷 Technician: {record.technicianName}
              </p>
              <p className="text-gray-500 mt-1">
                📅 Timings: {new Date(record.date).toLocaleDateString()} | ⏰ {record.time}
              </p>
              <p className="text-blue-600 font-medium mt-2">
                🔹 Pressure: {record.readingPressure} bar
              </p>

              <p
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                  record.recordType === "start"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                Record: {(record.recordType ?? "UNKNOWN").toUpperCase()}
              </p>

              {/* Image Handling */}
              {record.image && record.image.startsWith("data:image") ? (
                <div className="relative mt-4">
                  <img
                    src={record.image}
                    alt={`Record ${record.projectName}`}
                    className="w-full h-40 object-cover rounded-lg transition-transform transform hover:scale-105 cursor-pointer"
                    onClick={() => window.open(record.image, "_blank")}
                  />
                  <p className="text-xs text-center text-gray-500 mt-1">
                    Click to enlarge
                  </p>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg mt-4">
                  No Image Available
                </div>
              )}

              {/* ✅ PDF Button */}
              <button
                onClick={() => generatePDF(record._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">
          ❌ No records found
        </p>
      )}
    </div>
  );
}

