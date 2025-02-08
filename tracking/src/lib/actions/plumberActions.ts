'use server'

import { revalidatePath } from 'next/cache'
import TestRecord from '@/models/plumberModel'
import { connectToDatabase } from '@/utils/db'

// export async function createCrud(
//     projectName: string,
//     locationAddress: string,
//     technicianName: string,
//     floorName: string,
//     recordType: 'start' | 'end',
//     date: string,
//     time: string,
//     readingPressure: number,
//     pipingImageUrl: string
// ) {
//     try {
//         await connectToDatabase()
//         console.log('Connected to database')

//         // Validate input data
//         if (!technicianName || !floorName || !readingPressure) {
//             throw new Error('Missing required fields')
//         }

//         // Create new record with explicit date handling
//         const newRecord = await TestRecord.create({
//             projectName: projectName.trim(),
//             locationAddress: locationAddress.trim(),
//             technicianName: technicianName.trim(),
//             floorName: floorName.trim(),
//             recordType: recordType, // Explicitly set record type
//             date: new Date(date), // Convert string date to Date object
//             time: time,
//             readingPressure: Number(readingPressure),
//             pipingImageUrl: pipingImageUrl.trim()
//         })

//         console.log('Created new record:', newRecord)

//         // Serialize the new record before returning
//         const serializedRecord = {
//             _id: newRecord._id.toString(),
//             projectName: newRecord.projectName,
//             locationAddress: newRecord.locationAddress,
//             technicianName: newRecord.technicianName,
//             floorName: newRecord.floorName,
//             recordType: newRecord.recordType,
//             date: newRecord.date.toISOString(),
//             time: newRecord.time,
//             readingPressure: newRecord.readingPressure,
//             pipingImageUrl: newRecord.pipingImageUrl,
//             createdAt: newRecord.createdAt?.toISOString(),
//             updatedAt: newRecord.updatedAt?.toISOString()
//         }

//         revalidatePath('/ui')

//         return { 
//             success: true, 
//             data: serializedRecord 
//         }
//     } catch (error) {
//         console.error('Error in createCrud:', error)
//         return { 
//             success: false, 
//             error: error instanceof Error ? error.message : 'Failed to create record'
//         }
//     }
// }


export async function createCrud(
  projectName: string,
  locationAddress: string,
  technicianName: string,
  floorName: string,
  recordType: 'start' | 'end',
  date: string,
  time: string,
  readingPressure: number,
  imageBase64: string // Receive image as base64
) {
  try {
    await connectToDatabase();

    const newRecord = new TestRecord({
      projectName,
      locationAddress,
      technicianName,
      floorName,
      recordType,
      date,
      time,
      readingPressure,
      image: imageBase64, // Store image in base64
    });

    await newRecord.save();
    revalidatePath('/'); // Refresh UI

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getAllCruds() {
    try {
        await connectToDatabase()

        const records = await TestRecord.find({})
            .sort({ createdAt: -1 })
            .lean()
            .exec()

        const serializedRecords = records.map(record => {
            const id = record._id && typeof record._id === 'object' && record._id.toString ? 
                record._id.toString() : 
                record._id;

            return {
                ...record,
                _id: id,
                date: record.date instanceof Date ? record.date.toISOString() : record.date,
                createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
                updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
            };
        });

        return { 
            success: true, 
            cruds: serializedRecords 
        }
    } catch (error) {
        console.error('Error in getAllCruds:', error)
        return { 
            success: false, 
            error: 'Failed to fetch records'
        }
    }
}


// Define the TypeScript type for test records
export type TestRecordType = {
  _id: string;
  projectName: string;
  locationAddress: string;
  technicianName: string;
  floorName: string;
  recordType: "start" | "end";
  date: string;
  time: string;
  readingPressure: number;
  image: string;
};

// Server action to fetch all test records
export async function getTestRecords(): Promise<TestRecordType[]> {
  try {
    await connectToDatabase();
    
    const records = await TestRecord.find().lean().select("-__v"); // Fetch records without __v

    return records.map((record) => ({
      _id: String(record._id), // Ensure _id is always a string
      projectName: record.projectName,
      locationAddress: record.locationAddress,
      technicianName: record.technicianName,
      floorName: record.floorName,
      recordType: record.recordType,
      date: record.date,
      time: record.time,
      readingPressure: record.readingPressure,
      image: record.image,
    }));
  } catch (error) {
    console.error("Error fetching test records:", error);
    return [];
  }
}



export async function deleteCrud(id: string) {
    try {
        await connectToDatabase()

        if (!id) {
            throw new Error('Record ID is required')
        }

        const deletedRecord = await TestRecord.findByIdAndDelete(id)
        
        if (!deletedRecord) {
            throw new Error('Record not found')
        }

        revalidatePath('/ui')

        return { success: true }
    } catch (error) {
        console.error('Error in deleteCrud:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to delete record'
        }
    }
}

export async function getRecordsByType(recordType: 'start' | 'end') {
    try {
        await connectToDatabase()

        const records = await TestRecord.find({ recordType })
            .sort({ date: -1, time: -1 })
            .lean()
            .exec()

        const serializedRecords = records.map(record => {
            const id = record._id && typeof record._id === 'object' && record._id.toString ? 
                record._id.toString() : 
                record._id;

            return {
                ...record,
                _id: id,
                date: record.date instanceof Date ? record.date.toISOString() : record.date,
                createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
                updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
            };
        });

        return { 
            success: true, 
            cruds: serializedRecords 
        }
    } catch (error) {
        console.error('Error in getRecordsByType:', error)
        return { 
            success: false, 
            error: 'Failed to fetch records'
        }
    }
}