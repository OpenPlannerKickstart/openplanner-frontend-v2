import React from 'react'
import {  isNullUndefinedOrBlank } from '../Utility/Helper'

import FolderSvg from "../assets/images/extensions-icon/Folder.svg";
import IMGSvg from "../assets/images/extensions-icon/IMG.svg";
import PDFSvg from "../assets/images/extensions-icon/PDF.svg";
import FIGSvg from "../assets/images/extensions-icon/FIG.svg";
import HTMLSvg from "../assets/images/extensions-icon/HTML.svg";
import JSONSvg from "../assets/images/extensions-icon/JSON.svg";
import MP3Svg from "../assets/images/extensions-icon/MP3.svg";
import JPGSvg from "../assets/images/extensions-icon/JPG.svg";
import DOCSvg from "../assets/images/extensions-icon/DOC.svg";
import AISvg from "../assets/images/extensions-icon/AI.svg";
import CSSSvg from "../assets/images/extensions-icon/CSS.svg";
import JAVASvg from "../assets/images/extensions-icon/JAVA.svg";
import WAVSvg from "../assets/images/extensions-icon/WAV.svg";
import JPEGSvg from "../assets/images/extensions-icon/JPEG.svg";
import DOCXSvg from "../assets/images/extensions-icon/DOCX.svg";
import PSDSvg from "../assets/images/extensions-icon/PSD.svg";
import RSSSvg from "../assets/images/extensions-icon/RSS.svg";
import XMLSvg from "../assets/images/extensions-icon/XML.svg";
import MP4Svg from "../assets/images/extensions-icon/MP4.svg";
import PNGSvg from "../assets/images/extensions-icon/PNG.svg";
import TXTSvg from "../assets/images/extensions-icon/TXT.svg";
import INDDSvg from "../assets/images/extensions-icon/INDD.svg";
import SQLSvg from "../assets/images/extensions-icon/SQL.svg";
import EXESvg from "../assets/images/extensions-icon/EXE.svg";
import MPEGSvg from "../assets/images/extensions-icon/MPEG.svg";
import WEBPSvg from "../assets/images/extensions-icon/WEBP.svg";
import CSVSvg from "../assets/images/extensions-icon/CSV.svg";
import AEPSvg from "../assets/images/extensions-icon/AEP.svg";
import JSSvg from "../assets/images/extensions-icon/JS.svg";
import DMGSvg from "../assets/images/extensions-icon/DMG.svg";
import AVISvg from "../assets/images/extensions-icon/AVI.svg";
import MKVSvg from "../assets/images/extensions-icon/MKV.svg";
import TIFFSvg from "../assets/images/extensions-icon/TIFF.svg";
import XLSXSvg from "../assets/images/extensions-icon/XLSX.svg";
import GIFSvg from "../assets/images/extensions-icon/GIF.svg";
import PPTSvg from "../assets/images/extensions-icon/PPT.svg";
import SVGSvg from "../assets/images/extensions-icon/SVG.svg";
import PPTXSvg from "../assets/images/extensions-icon/PPTX.svg";
import EPSSvg from "../assets/images/extensions-icon/EPS.svg";
import XLSSvg from "../assets/images/extensions-icon/XLS.svg";
import ImageSvg from "../assets/images/extensions-icon/Image.svg";
import VideoSvg from "../assets/images/extensions-icon/Video.svg";
import AudioSvg from "../assets/images/extensions-icon/Audio.svg";
import CodeSvg from "../assets/images/extensions-icon/Code.svg";
import Video2Svg from "../assets/images/extensions-icon/Video 2.svg";
import DocumentSvg from "../assets/images/extensions-icon/Document.svg";
import SpreadsheetSvg from "../assets/images/extensions-icon/Spreadsheet.svg";
import PDF1Svg from "../assets/images/extensions-icon/PDF-1.svg";
import ZIPSvg from "../assets/images/extensions-icon/ZIP.svg";
import RARSvg from "../assets/images/extensions-icon/RAR.svg";
import EmptySvg from "../assets/images/extensions-icon/Empty.svg";



function GetImageIcon(props) {

    const handleGetImageIcon = (val) => {


        // if (isEmptyObjectOrNullUndefiend(val)) {
        //     return
        // }
        const url = val
        // const imageNameWithExtension:any = url.split('/').pop(); 
        // const originalName = imageNameWithExtension?.split('-').pop().replace('.png', '.jpg');
        const extension = url?.split('.')?.pop()?.toLowerCase().trim();
        let updatedImg:any = null
        // const showImage = !isNullUndefinedOrBlank(val?.url) ? val?.url : URL.createObjectURL(val);
        switch (extension) {
            case "png":
                // updatedImg = showImage
                updatedImg = PNGSvg;
                break;
            case "json":
                updatedImg = JSONSvg;
                break;
            case "svg":
                updatedImg = SVGSvg;
                break;
            case "jpg":
                updatedImg = JPGSvg;
                // updatedImg = showImage;
                break;
            case "jpeg":
                // updatedImg = showImage;
                updatedImg = JPEGSvg;
                break;
            case "doc":
                updatedImg = DOCSvg;
                break;
            case "docx":
                updatedImg = DOCXSvg;
                break;
            case "pdf":
                updatedImg = PDFSvg;
                break;
            case "ppt":
                updatedImg = PPTSvg;
                break;
            case "pptx":
                updatedImg = PPTXSvg;
                break;
            case "xls":
                updatedImg = XLSSvg;
                break;
            case "xlsx":
                updatedImg = XLSXSvg;
                break;
            case "csv":
                updatedImg = CSVSvg;
                break;
            case "mp3":
                updatedImg = MP3Svg;
                break;
            case "wav":
                updatedImg = WAVSvg;
                break;
            case "mp4":
                updatedImg = MP4Svg;
                break;
            case "avi":
                updatedImg = AVISvg;
                break;
            case "mkv":
                updatedImg = MKVSvg;
                break;
            case "mpeg":
                updatedImg = MPEGSvg;
                break;
            case "gif":
                updatedImg = GIFSvg;
                break;
            case "tiff":
                updatedImg = TIFFSvg;
                break;
            case "webp":
                updatedImg = WEBPSvg;
                break;
            case "html":
                updatedImg = HTMLSvg;
                break;
            case "css":
                updatedImg = CSSSvg;
                break;
            case "js":
                updatedImg = JSSvg;
                break;
            case "java":
                updatedImg = JAVASvg;
                break;
            case "sql":
                updatedImg = SQLSvg;
                break;
            case "xml":
                updatedImg = XMLSvg;
                break;
            case "rss":
                updatedImg = RSSSvg;
                break;
            case "txt":
                updatedImg = TXTSvg;
                break;
            case "exe":
                updatedImg = EXESvg;
                break;
            case "dmg":
                updatedImg = DMGSvg;
                break;
            case "aep":
                updatedImg = AEPSvg;
                break;
            case "psd":
                updatedImg = PSDSvg;
                break;
            case "ai":
                updatedImg = AISvg;
                break;
            case "eps":
                updatedImg = EPSSvg;
                break;
            case "indd":
                updatedImg = INDDSvg;
                break;
            case "zip":
                updatedImg = ZIPSvg;
                break;
            case "rar":
                updatedImg = RARSvg;
                break;
            case "img":
                // updatedImg = showImage;
                updatedImg = IMGSvg;
                break;
            case "folder":
                updatedImg = FolderSvg;
                break;
            case "video":
                updatedImg = VideoSvg;
                break;
            case "audio":
                updatedImg = AudioSvg;
                break;
            case "code":
                updatedImg = CodeSvg;
                break;
            case "spreadsheet":
                updatedImg = SpreadsheetSvg;
                break;
            case "document":
                updatedImg = DocumentSvg;
                break;
            default:
                updatedImg = EmptySvg;
                break;
      
        }
      
      
      
        return updatedImg;
      }

  return (
    <a >
        <img src={handleGetImageIcon(props?.image) as any} alt="attachments" />
    </a>
  )
}

export default GetImageIcon