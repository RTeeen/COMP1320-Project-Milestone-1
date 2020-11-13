/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * 
 * Created Date: November 8th 2020
 * Author: Artin Peyvasteh
 * 
 */

const unzipper = require('unzipper'),
  fs = require('fs'),
  fsP = fs.promises,
  PNG = require('pngjs').PNG,
  path = require('path');
  


/**
 * Description: decompress file from given pathIn, write to given pathOut 
 *  
 * @param {string} pathIn 
 * @param {string} pathOut 
 * @return {promise}
 */

const unzip = (pathIn, pathOut) => {
  return new Promise((resolve,reject)=>{
    fs.createReadStream(pathIn)
      .pipe(
        unzipper.Extract({ path: pathOut})
      )
      .on("finish",function(){

        resolve("Extraction Completed");
      })
      .on("error", function(){
        reject("There was an error while extracting the file!");
      })
    
      
  });

};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path 
 * 
 * @param {string} path 
 * @return {promise}
 * 
 * 
 */
let pngFiles =[];
let pathFiles =[];

const readDir = dir => {
return new Promise((resolve, reject)=>{
  fsP.readdir(dir, "utf8")
    .then((data)=> {
      pngFiles = data.filter((file)=> path.extname(file).toLowerCase() == ".png")
      pngFiles.forEach(element => pathFiles.push(path.resolve(`./unzipped/${element}`)))

      resolve(pathFiles);
    })
    .catch((err)=> reject(err))

});
};

/**
 * Description: Read in png file by given pathIn, 
 * convert to grayscale and write to given pathOut
 * 
 * @param {string} filePath 
 * @param {string} pathProcessed 
 * @return {promise}
 * 
 */

 
let average,idx=0;
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve,reject)=>{
    pathIn.forEach(element => {
      fs.createReadStream(element)
      .pipe(new PNG())
      .on("parsed",function(data){
        let fileName = path.win32.basename(element);
        while(idx <= ((this.width*this.height)*4)){//Times 4 is because for each pixel, there is R,G,B,A
          average = (this.data[idx]+this.data[idx+1]+this.data[idx+2])/3;
          this.data[idx]= average;
          this.data[idx+1]= average;
          this.data[idx+2]= average;
          idx += 4;
        }
        idx = 0;
        this.pack().pipe(fs.createWriteStream(`${pathOut}/GS_${fileName}`));
        resolve("Grayscale filter applied to all the photos in the directory!");
      })
      .on("error",(error)=>{
        reject(error);
      })
      
    });
    
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale
};

