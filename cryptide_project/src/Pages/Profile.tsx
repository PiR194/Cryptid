import React, { useState } from 'react';

const ProfilePictureUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // @ts-ignore
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Validez la taille, le format, etc.
    setSelectedFile(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && (
        <div>
          {/* @ts-ignore */}
          <p>Selected File: {selectedFile.name}</p>
          <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
