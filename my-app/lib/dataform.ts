"use server";

import connectDB from "@/libm/db";

import TestRecord from "@/libm/models/form";

export async function addTestRecord(formData: FormData) {
  await connectDB();
  try {
    const newTest = await TestRecord.create({
      technicianName: formData.get("technicianName"),
      floorName: formData.get("floorName"),
      startDate: new Date(formData.get("startDate") as string),
      startTime: formData.get("startTime"),
      endDate: new Date(formData.get("endDate") as string),
      endTime: formData.get("endTime"),
      readingPressure: Number(formData.get("readingPressure")),
      pipingImageUrl: formData.get("pipingImageUrl"),
    });

    return { success: true, message: "✅ Test record added successfully", test: newTest };
  } catch (error) {
    console.error(error); // Log the error for debugging
    return { success: false, message: "❌ Error adding test record" };
  }
}


export async function getTestRecords() {
  await connectDB();
  try {
    const tests = await TestRecord.find();
    return { success: true, tests };
  } catch (error) {
    return { success: false, message: "❌ Error fetching test records", error };
  }
}

export async function deleteTestRecord(id: string) {
  await connectDB();
  try {
    await TestRecord.findByIdAndDelete(id);
    return { success: true, message: "✅ Test record deleted successfully" };
  } catch (error) {
    return { success: false, message: "❌ Error deleting test record", error };
  }
}
