import React, { useState } from 'react';
import '../Pages/Profile.css'
import dl from '../res/icon/download.png'
import defaultImg from '../res/img/Person.png'

const ProfilePDP = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    // @ts-ignore
    const handleFileChange = (event) => {
        let file = event.target.files[0];
        // Validez la taille, le format, etc.
        // if (file == null){
        //     file = defaultImg;
        // }
        setSelectedFile(file);
    };

    return (
        <div className='mainPDPContainer'>
                {selectedFile && (
                    <div >
                    {/* @ts-ignore */}
                    {/* <p>Selected File: {selectedFile.name}</p> */}
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className='imgContainer' width='100px' height='100px' />
                    </div>
                )}
                <div className="parent">
                    <div className="file-upload">
                        <img src={dl} alt="upload" width='25px' height='25px'/>
                        {/* <h6>Cliquer ici pour ajouter une image</h6> */}
                        <p>Taille recommandée : 100px</p>
                        <input type="file" accept="image/*" onChange={handleFileChange}/>
                    </div>
                </div>
                {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
            </div>
    );
};

export default ProfilePDP;