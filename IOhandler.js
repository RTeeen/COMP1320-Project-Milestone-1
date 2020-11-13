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
let average,x=0,R=0,G=1,B=2;
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve,reject)=>{
    pathIn.forEach(element => {
      fs.createReadStream(element)
      .pipe(new PNG())
      .on("parsed",function(data){
        let fileName= path.win32.basename(element);
        while(x<=(this.width*this.height)){
          average= (this.data[R]+this.data[G]+this.data[B])/3;
          this.data[R]= average;
          this.data[G]= average;
          this.data[B]= average;
          R=R+4;
          G=G+4;
          B=B+4;
          x++;
        }
        R=0;
        G=1;
        B=2;
        x=0;
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

