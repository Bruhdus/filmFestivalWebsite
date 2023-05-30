import React from 'react';

interface ImageInputProps {
    onImageSelect:(image: File) => void;
    required: boolean
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect , required}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <div className="image-input">
            <input id="imageSelect" type="file" accept="image/jpeg, image/png, image/gif" required={required} onChange={handleInputChange} />
        </div>
    );
};

export default ImageInput;
