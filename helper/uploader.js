const multer = require("multer");
// file/directory checking
const fs = require("fs");

module.exports = {
  uploader: (directory, fileNamePrefix) => {
    //   defining where to store data image
    let defaultDirectory = "./public";

    // diskStorage: a function to store file from fe into public
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const pathDirectory = defaultDirectory + directory;

        // condition: checking if the directory existed or not
        if (fs.existsSync(pathDirectory)) {
          console.log("Directory is existed");

          cb(null, pathDirectory);
          // created new directory(mkdir) if the designated directory isnt existed
        } else {
          fs.mkdir(pathDirectory, { recursive: true }, (err) =>
            cb(err, pathDirectory)
          );
        }
      },
      // fileNaming
      filename: (req, file, cb) => {
        let ext = file.originalname.split(".");
        let filename = fileNamePrefix + Date.now() + "." + ext[ext.length - 1];
        cb(null, filename);
      },
    });

    const fileFilter = (req, file, cb) => {
      const ext = /\.(jpg|jpeg|png|gif|pdf|txt|JPG|PNG|JPEG)/;
      if (!file.originalname.match(ext)) {
        return cb(new Error("Your file type are denied"), false);
      }
      cb(null, true);
    };

    return multer({
      storage,
      fileFilter,
    });
  },
};
