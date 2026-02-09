// Reusable fetch function
async function request(url, options) {
  const res = await fetch(url, options);

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      `Request failed (${res.status}) for URL: ${url} - ${data.message || "Unknown error"}`,
    );
  }

  return res.json();
}
export async function fetchAvailablePlaces() {
  const res = await request("http://localhost:1050/places");
  return res.places;
}

export async function fetchUserPlaces() {
  const res = await request("http://localhost:1050/user-places");
  return res.places;
}

export async function updateUserPlaces(places) {
  const res = await request("http://localhost:1050/user-places", {
    method: "PUT",
    body: JSON.stringify({ places }), // shorthand { places } is fine
    headers: { "Content-Type": "application/json" },
  });
  return res.message; // return success message
}
