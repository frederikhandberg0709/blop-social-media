export const fetchUserColor = async (userId: string) => {
  try {
    const response = await fetch(`/api/user-color?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user color");
    }
    const data = await response.json();
    return data.color;
  } catch (error) {
    console.error(error);
    return "#3b82f6"; // Default color if fetching fails
  }
};
