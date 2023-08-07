export const makeFetch = async <TData>(url: string): Promise<TData> => {
  const response = await fetch(url)
  const data = await response.json()

  return data
}
