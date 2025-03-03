import React from 'react';
import "../../css/AddPropertyStyles/DragAndDrop.css";
import { useState, useRef } from 'react';

function DragAndDrop({ images, setImages, updateFormData }) {
    
    const [isDragging,setIsDragging]=useState(false);
    const fileInputRef=useRef(null); 

    function selectFiles(){
        fileInputRef.current.click();
    }

    function onFileSelect(event){
        const files=event.target.files;
        if(files.length===0){
            return;
        }
        const newImages=[];
        for(let i=0;i<files.length; i++){
            if(files[i].type.split('/')[0]!=='image') continue;
            /* if(!images.some((e)=>e.name===files[i].name)){
                setImages((prev)=>[...prev,{
                    name:files[i].name,
                    url:URL.createObjectURL(files[i]),
                }]);
            } */
            newImages.push({
                name: files[i].name,
                url: URL.createObjectURL(files[i]),
            });
            
        }
        setImages((prev) => {
            const updatedImages = [...prev, ...newImages];
            updateFormData("photos", updatedImages); // Update formData
            return updatedImages;
        });
        event.target.value = "";
    }

    function deleteImage(index){
        /* setImages((prevImages)=>{
            URL.revokeObjectURL(prevImages[index].url);
            return prevImages.filter((_,i)=>i!==index);
        }
        ); */
        setImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            updateFormData("photos", updatedImages); // Update formData
            URL.revokeObjectURL(prevImages[index].url);
            return updatedImages;
        });
    }

    function onDragOver(event){
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect="copy";
    }

    function onDragLeave(event){
        event.preventDefault();
        setIsDragging(false);
    }

    function onDrop(event){
        event.preventDefault();
        setIsDragging(false);
        const files=event.dataTransfer.files;
        if(files.length===0){
            return;
        }
        const newImages=[];
        for(let i=0;i<files.length; i++){
            if(files[i].type.split('/')[0]!=='image') continue;
            /* if(!images.some((e)=>e.name===files[i].name)){
                setImages((prev)=>[...prev,{
                    name:files[i].name,
                    url:URL.createObjectURL(files[i]),
                }]);
            } */
            newImages.push({
                name: files[i].name,
                url: URL.createObjectURL(files[i]),
            });
            
        }
        setImages((prev)=>[...prev,...newImages]);
        event.target.value = "";
    }

    return (
        <div className="drag-and-drop">
            <div className="drag-top">
                <p>Drag & Drop image uploading</p>
            </div>
            <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging?(
                    <span className="drag-select">
                    Drop images here
                </span>
                ):(
                    <>
                    Drag & Drop image here or {" "}
                    <span className="drag-select" role="button" onClick={selectFiles} style={{ textDecoration: "underline" }}>
                        Browse
                    </span>
                    </>
                )} 
                <input name='file' type='file' className="file" multiple ref={fileInputRef} onChange={onFileSelect}></input>
            </div>
            <div className="drag-container">
                {images.map((image,index)=>(
                    <div className="drag-image" key={index}>
                    <span className="drag-delete" onClick={()=>deleteImage(index)}>&times;</span>
                    <img src={image.url} alt={image.name}/>
                </div>
                
                ))}
                
            </div>
        </div>
    )
}

export default DragAndDrop