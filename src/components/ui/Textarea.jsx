import React from "react";
import { cn } from "../../utils/cn";

const Textarea = React.forwardRef(({
    className,
    label,
    description,
    error,
    required = false,
    id,
    rows = 3,
    resize = "vertical",
    maxLength,
    showCharCount = false,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Base textarea classes
    const baseTextareaClasses = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Resize classes
    const resizeClasses = {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize"
    };

    // Character count
    const currentLength = props.value ? props.value.length : 0;
    const showCount = showCharCount || maxLength;

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={textareaId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    maxLength={maxLength}
                    className={cn(
                        baseTextareaClasses,
                        resizeClasses[resize],
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    {...props}
                />

                {showCount && (
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1">
                        {maxLength ? `${currentLength}/${maxLength}` : currentLength}
                    </div>
                )}
            </div>

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

Textarea.displayName = "Textarea";

export default Textarea;
