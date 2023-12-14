import * as fs from "fs";
const path = require('path');
const  pdf = require('pdf-parse');

/**
 * 
 * @param pathToPdf - path to pdf file
 * @description - read pdf file and return text content
 * @returns text content of the PDF file
 */

export const readPdfFunc = (pathToPdf: string): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof pathToPdf !== 'string') {
        throw new Error('pathToPdf must be a string')
      }
  
      const pdfPath = path.resolve(pathToPdf)
      let dataBuffer = fs.readFileSync(pdfPath);
      pdf(dataBuffer).then(({ text }) => {
        resolve(text)
      });
    });
}