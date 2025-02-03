"use client";

import { addTestRecord } from "lib/dataform";
import { useState } from "react";

export default function TestRecordForm() {
  const [formData, setFormData] = useState({
    technicianName: "",
    floorName: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    readingPressure: "",
    pipingImageUrl: "",
  });

  // Convert form data to FormData object
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData object
    const form = new FormData();
    form.append("technicianName", formData.technicianName);
    form.append("floorName", formData.floorName);
    form.append("startDate", formData.startDate);
    form.append("startTime", formData.startTime);
    form.append("endDate", formData.endDate);
    form.append("endTime", formData.endTime);
    form.append("readingPressure", formData.readingPressure);
    form.append("pipingImageUrl", formData.pipingImageUrl);

    // Submit the FormData
    const response = await addTestRecord(form);
    alert(response.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Technician Name"
        onChange={(e) =>
          setFormData({ ...formData, technicianName: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Floor Name"
        onChange={(e) =>
          setFormData({ ...formData, floorName: e.target.value })
        }
        required
      />
      <input
        type="date"
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        required
      />
      <input
        type="time"
        onChange={(e) =>
          setFormData({ ...formData, startTime: e.target.value })
        }
        required
      />
      <input
        type="date"
        onChange={(e) =>
          setFormData({ ...formData, endDate: e.target.value })
        }
        required
      />
      <input
        type="time"
        onChange={(e) =>
          setFormData({ ...formData, endTime: e.target.value })
        }
        required
      />
      <input
        type="number"
        placeholder="Reading Pressure"
        onChange={(e) =>
          setFormData({ ...formData, readingPressure: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Piping Image URL"
        onChange={(e) =>
          setFormData({ ...formData, pipingImageUrl: e.target.value })
        }
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
