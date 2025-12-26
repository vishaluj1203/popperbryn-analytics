import React from 'react';

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="max-w-xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};
