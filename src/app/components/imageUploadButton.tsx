import { useEffect, useRef, useState } from "react";

type ImageUploadButtonProps = Readonly<{
  onFileSelect: (file: File) => void;
  initialImageUrl?: string | null;
  onRemoveImage?: () => void;
}>;

export default function ImageUploadButton({
  onFileSelect,
  initialImageUrl,
  onRemoveImage,
}: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile && initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    }
  }, [initialImageUrl, selectedFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemoveImage?.();
  };

  return (
    <div className="flex items-center justify-center w-full">
      {previewUrl ? (
        <div className="relative w-full">
          {/* Miniatura */}
          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden py-1">
            <img alt="Preview" className="object-contain h-full w-full" src={previewUrl} />
          </div>

          {/* Botón para cambiar imagen */}
          <button
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            onClick={handleClick}
            type="button"
          >
            Change image
          </button>

          {/* Botón para eliminar imagen */}
          <button
            className="mt-2 ml-2 text-sm text-red-600 hover:text-red-800"
            onClick={handleRemoveImage}
            type="button"
          >
            Remove
          </button>

          <input
            accept="image/*"
            className="hidden"
            id="dropzone-file"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
        </div>
      ) : (
        <button
          aria-label="Upload image"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-left"
          onClick={handleClick}
          type="button"
        >
          <span className="sr-only">Upload image</span>

          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mb-4 text-gray-500"
              fill="none"
              viewBox="0 0 20 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>

          <input
            accept="image/*"
            className="hidden"
            id="dropzone-file"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
        </button>
      )}
    </div>
  );
}
