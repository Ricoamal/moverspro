import React, { useState, useRef } from "react";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";
import Button from "./Button";

const FileUpload = React.forwardRef(({
    className,
    label,
    description,
    error,
    required = false,
    id,
    accept,
    multiple = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    maxFiles = 1,
    onFileSelect,
    onFileRemove,
    disabled = false,
    showPreview = true,
    dragAndDrop = true,
    ...props
}, ref) => {
    const [files, setFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Generate unique ID if not provided
    const uploadId = id || `file-upload-${Math.random().toString(36).substr(2, 9)}`;

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file) => {
        if (file.size > maxSize) {
            return `File size exceeds ${formatFileSize(maxSize)}`;
        }
        return null;
    };

    const handleFileSelect = (selectedFiles) => {
        const fileArray = Array.from(selectedFiles);
        const validFiles = [];
        const errors = [];

        fileArray.forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            console.error('File validation errors:', errors);
            return;
        }

        const newFiles = multiple 
            ? [...files, ...validFiles].slice(0, maxFiles)
            : validFiles.slice(0, 1);

        setFiles(newFiles);
        onFileSelect?.(multiple ? newFiles : newFiles[0]);
    };

    const handleFileRemove = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFileRemove?.(index);
        onFileSelect?.(multiple ? newFiles : newFiles[0] || null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!disabled && dragAndDrop) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        if (!disabled && dragAndDrop) {
            const droppedFiles = e.dataTransfer.files;
            handleFileSelect(droppedFiles);
        }
    };

    const openFileDialog = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const getFileIcon = (file) => {
        const type = file.type;
        if (type.startsWith('image/')) return 'Image';
        if (type.startsWith('video/')) return 'Video';
        if (type.startsWith('audio/')) return 'Music';
        if (type.includes('pdf')) return 'FileText';
        if (type.includes('word') || type.includes('document')) return 'FileText';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'FileSpreadsheet';
        return 'File';
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label
                    htmlFor={uploadId}
                    className={cn(
                        "text-sm font-medium leading-none",
                        error ? "text-destructive" : "text-foreground",
                        disabled && "opacity-50"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                id={uploadId}
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                {...props}
            />

            {/* Upload area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragOver && !disabled 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-300 hover:border-gray-400",
                    disabled && "cursor-not-allowed opacity-50 bg-gray-50",
                    error && "border-destructive"
                )}
            >
                <div className="space-y-2">
                    <Icon 
                        name="Upload" 
                        size={32} 
                        className={cn(
                            "mx-auto",
                            isDragOver && !disabled ? "text-primary" : "text-gray-400"
                        )} 
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {dragAndDrop ? "Drop files here or click to browse" : "Click to browse files"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {accept && `Accepted formats: ${accept}`}
                            {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                            {multiple && maxFiles > 1 && ` • Max files: ${maxFiles}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* File list */}
            {showPreview && files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <Icon 
                                    name={getFileIcon(file)} 
                                    size={20} 
                                    className="text-gray-500 flex-shrink-0" 
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                iconName="X"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileRemove(index);
                                }}
                                disabled={disabled}
                                className="flex-shrink-0"
                            />
                        </div>
                    ))}
                </div>
            )}

            {description && !error && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
});

FileUpload.displayName = "FileUpload";

export default FileUpload;
