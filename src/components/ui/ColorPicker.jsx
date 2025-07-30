import React, { useState } from "react";
import { cn } from "../../utils/cn";
import Input from "./Input";

const ColorPicker = React.forwardRef(({
    className,
    label,
    description,
    error,
    required = false,
    id,
    value = "#000000",
    onChange,
    disabled = false,
    showInput = true,
    presets = [],
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    // Generate unique ID if not provided
    const colorPickerId = id || `color-picker-${Math.random().toString(36).substr(2, 9)}`;

    const defaultPresets = [
        "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
        "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
        "#FFC0CB", "#A52A2A", "#808080", "#000080", "#008000"
    ];

    const colorPresets = presets.length > 0 ? presets : defaultPresets;

    const handleColorChange = (newColor) => {
        onChange?.(newColor);
    };

    const handleInputChange = (e) => {
        const newColor = e.target.value;
        handleColorChange(newColor);
    };

    const handlePresetClick = (color) => {
        handleColorChange(color);
        setIsOpen(false);
    };

    const isValidHex = (hex) => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label
                    htmlFor={colorPickerId}
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

            <div className="flex items-center space-x-3">
                {/* Color preview and native picker */}
                <div className="relative">
                    <input
                        ref={ref}
                        type="color"
                        id={colorPickerId}
                        value={isValidHex(value) ? value : "#000000"}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className={cn(
                            "w-12 h-10 border border-input rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-destructive"
                        )}
                        {...props}
                    />
                </div>

                {/* Text input */}
                {showInput && (
                    <div className="flex-1">
                        <Input
                            value={value}
                            onChange={(e) => handleColorChange(e.target.value)}
                            placeholder="#000000"
                            disabled={disabled}
                            error={value && !isValidHex(value) ? "Invalid hex color" : undefined}
                            className="font-mono"
                        />
                    </div>
                )}

                {/* Preset toggle button */}
                {colorPresets.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        disabled={disabled}
                        className={cn(
                            "px-3 py-2 text-sm border border-input rounded hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50",
                            isOpen && "bg-accent text-accent-foreground"
                        )}
                    >
                        Presets
                    </button>
                )}
            </div>

            {/* Color presets */}
            {isOpen && colorPresets.length > 0 && (
                <div className="p-3 border border-input rounded-lg bg-background shadow-sm">
                    <div className="grid grid-cols-5 gap-2">
                        {colorPresets.map((color, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handlePresetClick(color)}
                                disabled={disabled}
                                className={cn(
                                    "w-8 h-8 rounded border-2 transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50",
                                    value === color 
                                        ? "border-primary ring-2 ring-primary ring-offset-2" 
                                        : "border-gray-300 hover:border-gray-400"
                                )}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Color info */}
            {value && isValidHex(value) && (
                <div className="text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                        <span>HEX: {value.toUpperCase()}</span>
                        <span>
                            RGB: {parseInt(value.slice(1, 3), 16)}, {parseInt(value.slice(3, 5), 16)}, {parseInt(value.slice(5, 7), 16)}
                        </span>
                    </div>
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

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
