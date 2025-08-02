import React, { ChangeEvent, useEffect, useState } from "react";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isSubmitted?: boolean;
  maxFileSizeInMB: number;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => string;
}

const FileUploadComponent = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      isSubmitted,
      className,
      onFileUpload,
      maxFileSizeInMB,
      ...rest
    },
    ref
  ) => {
    const [fileName, setFileName] = useState("No file Chosen");
    const [errorMessage, setErrorMessage] = useState(error);

    useEffect(() => {
      setErrorMessage(error);
    }, [error]);

    return (
      <div className={`flex flex-col ${className}`}>
        {label && <label className="my-1 font-semibold">{label}</label>}

        <div className="relative w-full max-w-md border rounded-md overflow-hidden">
          <input
            ref={ref}
            type="file"
            className={`absolute inset-0 opacity-0 cursor-pointer z-10 h-full w-full`}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              if (file.size > maxFileSizeInMB * 1024 * 1024) {
                setErrorMessage("File size exceeds 5MB limit.");
                e.target.value = ""
                setFileName("No File Chosen");
                return;
              } else {
                setErrorMessage("")
              }

              const name = onFileUpload(e);
              setFileName(name);
              rest.onChange?.(e);
            }}
            {...rest}
          />

          <div className="flex items-center bg-gray-50 text-white h-full border-black">
            <span className="bg-gray-700 text-sm font-semibold px-4 py-2 whitespace-nowrap">
              Choose file
            </span>
            <span className="ml-3 text-gray-400 text-sm truncate">
              {fileName}
            </span>
          </div>
        </div>

        {errorMessage && (
          <span
            className={`text-sm text-red-500 ${errorMessage && errorMessage !== "" ? "py-1" : ""}`}
          >
            {errorMessage || (isSubmitted && errorMessage) ? errorMessage : ""}
          </span>
        )}
      </div>
    );
  }
);

FileUploadComponent.displayName = "fileUploadComponent";
export default FileUploadComponent;
