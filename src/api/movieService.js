const BASE_URL = "/api";

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
