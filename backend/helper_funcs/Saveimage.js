async function moveImage (image, UploadPath) {
    return new Promise((resolve, reject) => {
        image.mv(UploadPath, (err) => {
            if (err) {
                console.log("Error uploading image while updating");
                console.log(err);
                reject({
                    success: false,
                    message: "Some internal server error, in uploading the picture."
                });
            } else {
                resolve();
            }
        });
    });
}

module.exports = moveImage;