export const DownloadHelper = {
  saveBlob: (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  parseBlobError: async (err: any): Promise<string> => {
    if (err.response?.data instanceof Blob) {
      const text = await err.response.data.text();
      try {
        const errorData = JSON.parse(text);
        return errorData.message || text;
      } catch {
        return text || "Failed to process file response";
      }
    }
    return err.response?.data?.message || err.message || "Unknown error";
  },
};
