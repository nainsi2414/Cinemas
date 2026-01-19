const BASE_URL = "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000";

export async function getNowShowingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movies`);
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Movie API Error:", error);
    return [];
  }
}
