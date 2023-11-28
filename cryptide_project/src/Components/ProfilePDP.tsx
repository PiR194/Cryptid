import React, { useState } from 'react';
import '../Pages/Profile.css'
import dl from '../res/icon/download.png'
import defaultImg from '../res/img/Person.png'
import { useAuth } from '../Contexts/AuthContext';

//@ts-ignore
const ProfilePDP = () => {
    const [selectedFile, setSelectedFile] = useState(null);


    const {user} = useAuth()
    // @ts-ignores
    const handleFileChange = (event) => {
        let file = event.target.files[0];

        setSelectedFile(file);
        if (file) {
            const pdpUrl = URL.createObjectURL(file);
            if (user!=null){
                user.profilePicture = pdpUrl
            }
        }
    };

    return (
        <div className='mainPDPContainer'>
                {selectedFile ? (
                    <div >
                    {/* @ts-ignore */}
                    {/* <p>Selected File: {selectedFile.name}</p> */}
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className='imgContainer' width='100px' height='100px' />
                    </div>
                ) : (
                    <div >
                    <img src={user?.profilePicture} alt="Preview" className='imgContainer' width='100px' height='100px' />
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
