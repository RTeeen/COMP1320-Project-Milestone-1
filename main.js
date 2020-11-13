/*
 * Project: COMP1320 Milestone 1
 * File Name: main.js
 * Description: Calling all of our modules in the main file.
 * 
 * Created Date: Nov 8th, 2020
 * Author: Artin Peyvasteh
 * 
 */

const {unzip, readDir,grayScale} = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;

  unzip(zipFilePath,pathUnzipped)
   .then((msg)=>{
      console.log(msg);
      return readDir(pathUnzipped);
    })
    .then((result)=>{
      return grayScale(result,pathProcessed);
    })
    .then((msg)=> console.log(msg))
    .catch((err)=> console.log(err))
