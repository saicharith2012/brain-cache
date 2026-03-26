import React, { ChangeEvent, useEffect, useState } from "react";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  maxFileSizeInMB: number;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => string;
}

const FileUploadComponent = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      className,
      onFileUpload,
      maxFileSizeInMB,
      ...rest
    },
    ref
  ) => {
    const [fileName, setFileName] = useState("");
    const [errorMessage, setErrorMessage] = useState(error);

    useEffect(() => {
      setErrorMessage(error);
    }, [error]);

    return (
      <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
        {label && <span className="text-[13px] font-medium text-ink">{label}</span>}

        <label
          className={`relative flex items-center gap-3 p-4 rounded-[10px] border border-dashed bg-matter cursor-pointer transition-colors focus-within:border-ink hover:border-ink/50 ${errorMessage ? "border-danger" : "border-ink/25"}`}
        >
          <input
            ref={ref}
            type="file"
            className="sr-only"
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              if (file.size > maxFileSizeInMB * 1024 * 1024) {
                setErrorMessage(`That file is over ${maxFileSizeInMB} MB. Choose a smaller PDF.`);
                e.target.value = "";
                setFileName("");
                return;
              } else if (file.type !== "application/pdf") {
                setErrorMessage("That file isn't a PDF. Choose a .pdf file.");
                e.target.value = "";
                setFileName("");
                return;
              } else {
                setErrorMessage("");
              }

              const name = onFileUpload(e);
              setFileName(name);
              rest.onChange?.(e);
            }}
            {...rest}
          />
          <span className="h-9 px-3 inline-flex items-center rounded-[10px] bg-ink text-matter text-[14px] font-semibold whitespace-nowrap">
            Choose PDF
          </span>
          <span className={`text-[14px] truncate ${fileName ? "text-ink" : "text-dim"}`}>
            {fileName || "No file chosen"}
          </span>
        </label>

        {errorMessage && (
          <span className="text-[13px] text-danger">{errorMessage}</span>
        )}
      </div>
    );
  }
);

FileUploadComponent.displayName = "fileUploadComponent";
export default FileUploadComponent;
