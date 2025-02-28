const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const fetchEntries = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch entries");
  }
  return await response.json();
};

export const createEntry = async (entryData: { image: string; name: string; position: string }) => {
  if (!API_URL) {
    throw new Error("API_URL is not defined");
  }
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entryData),
  });
  if (!response.ok) {
    throw new Error("Failed to create entry");
  }
  return await response.json();
};

export const updateEntry = async (id: number, entryData: { image: string; name: string; position: string }) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entryData),
  });
  if (!response.ok) {
    throw new Error("Failed to update entry");
  }
  return await response.json();
};

export const deleteEntry = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete entry");
  }
}; 