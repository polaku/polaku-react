import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import CancelIcon from '@material-ui/icons/Cancel';
import UploadAreaImg from '../Assets/upload-area.png';
import TambahFotoGedungImg from '../Assets/tambah-foto-gedung.png';
import ImageImg from '../Assets/image.png';

import { Button } from '@material-ui/core';

function DragAndDrop(props) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    let newFiles = files || []
    newFiles = [...newFiles, ...acceptedFiles]
    setFiles(newFiles)
  }, [files])

  useEffect(() => {
    props.handleFiles(files)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  const resetFile = () => {
    setFiles([])
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} style={{ border: '1px #adadad dashed', margin: '5px 0px', padding: 10, display: 'flex', justifyContent: 'center', cursor: props.status === 'room' && files.length === 1 ? null : 'pointer' }} >
      <input {...getInputProps()} disabled={props.status === 'room' && files.length === 1} accept={props.status === "employee" ? "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "image/png,image/jpeg"} />
      {
        isDragActive ?
          // true ?
          <div style={{ margin: props.status === "employee" ? 0 : 10, height: props.status === "employee" ? 124 : 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#7c7c7c' }}>Drop the files here ...</p>
          </div>
          : props.status === "room"
            ? files.length === 0
              ? <div style={{ border: '1px #d4d4d4 solid', padding: 20, width: 120, height: 120, textAlign: 'center', margin: 10, cursor: 'pointer' }}>
                <img src={TambahFotoGedungImg} alt="foto-gedung" style={{ width: 50, maxHeight: 50, alignSelf: 'center' }} />
                <p style={{ fontSize: 10, margin: 0, color: '#adadad' }}>Tambah foto Gedung</p>
              </div>
              : files.map((file, index) =>
                <div key={index} style={{ border: '1px #d4d4d4 solid', padding: 20, width: 120, height: 120, textAlign: 'center', margin: 10, position: 'relative' }}>
                  <img src={ImageImg} alt="address" style={{ width: 50, maxHeight: 50, alignSelf: 'center' }} />
                  <p style={{ fontSize: 10, margin: 0, overflow: 'hidden' }}>{file.name}</p>
                  <CancelIcon style={{ position: 'absolute', right: -10, top: -10, color: 'red', cursor: 'pointer' }} onClick={resetFile} />
                </div>
              )
            : props.status === "employee"
              ? files.length === 0
                ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0px' }}>
                  <img src={UploadAreaImg} alt="upload-area" style={{ width: 60, maxHeight: 60, alignSelf: 'center' }} />
                  <Button variant="outlined" style={{ maxWidth: 161, alignSelf: 'center', fontSize: 10 }} size="small" >
                    Pilih & Upload File
                  </Button>
                  <p style={{ margin: 0, marginTop: 10, color: '#c5c5c5' }}>Atau tarik file excel (.xls atau .xlsx) ke area ini</p>
                </div>
                : props.proses
                  ? <div style={{ height: 124, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <p style={{ margin: 0 }}>proses unggah ...</p>
                  </div>
                  : <div style={{ height: 124, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0px' }}>
                    <img src={UploadAreaImg} alt="upload-area" style={{ width: 60, maxHeight: 60, alignSelf: 'center', marginTop: 10 }} />
                    <p style={{ margin: 0, marginTop: 10 }}>File sudah terunggah</p>
                  </div>
              : <div style={{ display: 'flex', cursor: 'pointer', flexWrap: 'wrap' }}>
                {
                  files.map((file, index) =>
                    <div key={index} style={{ border: '1px #d4d4d4 solid', padding: 20, width: 120, height: 120, textAlign: 'center', margin: 10, cursor: 'pointer' }}>
                      <img src={ImageImg} alt="address" style={{ width: 50, maxHeight: 50, alignSelf: 'center' }} />
                      <p style={{ fontSize: 10, margin: 0, overflow: 'hidden' }}>{file.name}</p>
                    </div>
                  )
                }
                <div style={{ border: '1px #d4d4d4 solid', padding: 20, width: 120, height: 120, textAlign: 'center', margin: 10, cursor: 'pointer' }}>
                  <img src={TambahFotoGedungImg} alt="foto-gedung" style={{ width: 50, maxHeight: 50, alignSelf: 'center' }} />
                  <p style={{ fontSize: 10, margin: 0, color: '#adadad' }}>Tambah foto Gedung</p>
                </div>
              </div>
      }
    </div>
  )
}

export default DragAndDrop
