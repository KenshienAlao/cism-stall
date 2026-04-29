export const formData = (entity: any) => {
  const formData = new FormData();
  Object.entries(entity).forEach(([key, value]) => {
    if (key === "image" && !(value instanceof File)) {
      return;
    }
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
