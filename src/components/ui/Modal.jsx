import React, { useEffect } from "react";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";
import Button from "./Button";

const Modal = ({
    isOpen = false,
    onClose,
    title,
    description,
    children,
    footer,
    size = "default",
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className,
    overlayClassName,
    contentClassName,
    ...props
}) => {
    // Size variants
    const sizeClasses = {
        sm: "max-w-md",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-full mx-4"
    };

    // Handle escape key
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose?.();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black bg-opacity-50 transition-opacity",
                    overlayClassName
                )}
                onClick={handleOverlayClick}
            />

            {/* Modal container */}
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                {/* Modal content */}
                <div
                    className={cn(
                        "relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full",
                        sizeClasses[size],
                        className
                    )}
                    {...props}
                >
                    <div className={cn("bg-white", contentClassName)}>
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex-1">
                                    {title && (
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {title}
                                        </h3>
                                    )}
                                    {description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                
                                {showCloseButton && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        iconName="X"
                                        onClick={onClose}
                                        className="flex-shrink-0 ml-4"
                                    />
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Predefined modal variants
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    loading = false,
    ...props
}) => {
    const variantStyles = {
        default: "default",
        destructive: "destructive"
    };

    const footer = (
        <div className="flex justify-end space-x-3">
            <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
            >
                {cancelText}
            </Button>
            <Button
                variant={variantStyles[variant]}
                onClick={onConfirm}
                loading={loading}
            >
                {confirmText}
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footer}
            size="sm"
            {...props}
        >
            <p className="text-gray-600">{message}</p>
        </Modal>
    );
};

// Alert modal variant
const AlertModal = ({
    isOpen,
    onClose,
    title = "Alert",
    message,
    buttonText = "OK",
    variant = "default",
    ...props
}) => {
    const footer = (
        <div className="flex justify-end">
            <Button
                variant={variant}
                onClick={onClose}
            >
                {buttonText}
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footer}
            size="sm"
            {...props}
        >
            <p className="text-gray-600">{message}</p>
        </Modal>
    );
};

Modal.Confirm = ConfirmModal;
Modal.Alert = AlertModal;

export default Modal;
