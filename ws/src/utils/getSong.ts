export const getSong = async (url: string) => {
  try {
    const req = await fetch(`${process.env.RAPID_API}${url}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY ?? "",
        "X-RapidAPI-Host": process.env.RAPID_HOST ?? "",
      },
    });

    const result = await req.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const cleanUrl = (url: string) => {
  const urlObject = new URL(url);
  return urlObject.searchParams.get("v");
};
