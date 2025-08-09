import React, { useState } from "react";
import {Routes, BrowserRouter as Router, Route} from "react-router-dom";

function fileManage(){
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState();
    const [action, setAction] = useState();

    const handleSubmit =async (e) => {
        e.preventDefault();

        if(!file){
            return;
        }
        try {
            if (action=="download"){
                window.open(`https://resumeinfos.blob.core.windows.net/resumes/${file.name}?sv=2024-11-04&ss=b&srt=co&sp=rwdlaciytfx&se=2025-07-20T02:11:56Z&st=2025-07-19T17:56:56Z&spr=https&sig=BjhTf1bz%2FYHaOf3iVgYHGNJQu%2BBmPLq8RdPrGkRaG5E%3D`, "_blank");
                return;
            }
            let response = await fetch(`https://resumeinfos.blob.core.windows.net/resumes/${file.name}?sv=2024-11-04&ss=b&srt=co&sp=rwdlaciytfx&se=2025-07-20T02:11:56Z&st=2025-07-19T17:56:56Z&spr=https&sig=BjhTf1bz%2FYHaOf3iVgYHGNJQu%2BBmPLq8RdPrGkRaG5E%3D`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/pdf",
                    "x-ms-blob-type": "BlockBlob"
                },
                body: file
            });

        }
        catch(err){
             console.log(err);
        }

    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="file">
                    file
                </label>
                <input
                    type="file"
                    accept=".pdf"
                    id="file"
                    onChange={(e)=>setFile(e.target.files[0])}
                />
                <button type="submit">submit</button>
                <select onChange={(e) => setAction(e.target.value)}>
                    <option value="download">download file</option>
                    <option value="upload">upload file</option>
                </select>
            </form>
        </>
    )
}

export default fileManage;