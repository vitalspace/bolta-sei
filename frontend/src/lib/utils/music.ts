import { API_BASE } from "../../contants/constants";
export const getSound = async (video: string) => {
  console.log("Me llego esta mierda", video);

  const result = await fetch(`${API_BASE}/get-sound`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: video }),
  });
  return result.json();
};

export const cleanUrl = (url: string) => {
  const urlObject = new URL(url);
  return urlObject.searchParams.get("v");
};
