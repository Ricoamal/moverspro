import React from "react";
import { cn } from "../../utils/cn";

const Toggle = React.forwardRef(({
    className,
    id,
    checked = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    size = "default",
    onChange,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    // Size variants
    const sizeClasses = {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11"
    };

    const thumbSizeClasses = {
        sm: "h-3 w-3",
        default: "h-4 w-4", 
        lg: "h-5 w-5"
    };

    const translateClasses = {
        sm: checked ? "translate-x-3" : "translate-x-0",
        default: checked ? "translate-x-4" : "translate-x-0",
        lg: checked ? "translate-x-5" : "translate-x-0"
    };

    return (
        <div className={cn("flex items-start space-x-3", className)}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    id={toggleId}
                    checked={checked}
                    disabled={disabled}
                    required={required}
                    onChange={onChange}
                    className="sr-only"
                    {...props}
                />

                <label
                    htmlFor={toggleId}
                    className={cn(
                        "relative inline-flex items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer",
                        sizeClasses[size],
                        checked 
                            ? "bg-primary" 
                            : "bg-gray-200",
                        disabled && "cursor-not-allowed opacity-50",
                        error && "ring-2 ring-destructive"
                    )}
                >
                    <span
                        className={cn(
                            "pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out",
                            thumbSizeClasses[size],
                            translateClasses[size]
                        )}
                    />
                </label>
            </div>

            {(label || description) && (
                <div className="flex-1 min-w-0">
                    {label && (
                        <label
                            htmlFor={toggleId}
                            className={cn(
                                "block text-sm font-medium cursor-pointer",
                                error ? "text-destructive" : "text-foreground",
                                disabled && "cursor-not-allowed opacity-50"
                            )}
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </label>
                    )}

                    {description && !error && (
                        <p className={cn(
                            "text-sm text-muted-foreground mt-1",
                            disabled && "opacity-50"
                        )}>
                            {description}
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-destructive mt-1">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
});

Toggle.displayName = "Toggle";

export default Toggle;
