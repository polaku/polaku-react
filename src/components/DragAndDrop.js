// import React, { Component } from 'react'

// class DragAndDrop extends Component {
//   state = {
//     drag: false
//   }

//   dropRef = React.createRef()

//   handleDrag = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   handleDragIn = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     this.dragCounter++
//     if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
//       this.setState({ drag: true })
//     }
//   }

//   handleDragOut = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     this.dragCounter--
//     if (this.dragCounter === 0) {
//       this.setState({ drag: false })
//     }
//   }

//   handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     this.setState({ drag: false })
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       this.props.handleDrop(e.dataTransfer.files)
//       e.dataTransfer.clearData()
//       this.dragCounter = 0
//     }
//   }

//   componentDidMount() {
//     let div = this.dropRef.current
//     div.addEventListener('dragenter', this.handleDragIn)
//     div.addEventListener('dragleave', this.handleDragOut)
//     div.addEventListener('dragover', this.handleDrag)
//     div.addEventListener('drop', this.handleDrop)
//   }

//   componentWillUnmount() {
//     let div = this.dropRef.current
//     div.removeEventListener('dragenter', this.handleDragIn)
//     div.removeEventListener('dragleave', this.handleDragOut)
//     div.removeEventListener('dragover', this.handleDrag)
//     div.removeEventListener('drop', this.handleDrop)
//   }

//   render() {
//     return (
//       <div
//         style={{ display: 'inline-block', position: 'relative' }}
//         ref={this.dropRef}
//       >
//         {this.state.dragging &&
//           <div
//             style={{
//               border: 'dashed grey 4px',
//               backgroundColor: 'rgba(255,255,255,.8)',
//               position: 'absolute',
//               top: 0,
//               bottom: 0,
//               left: 0,
//               right: 0,
//               zIndex: 9999
//             }}
//           >
//             <div
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 right: 0,
//                 left: 0,
//                 textAlign: 'center',
//                 color: 'grey',
//                 fontSize: 36
//               }}
//             >
//               <div>drop here :)</div>
//             </div>
//           </div>
//         }
//         {this.props.children}
//       </div>
//     )
//   }
// }

// export default DragAndDrop


import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} style={{ border: '1px #adadad dashed', margin: '5px 0px', padding: 10, display: 'flex', justifyContent: 'center' }}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <div style={{ margin: 10, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#7c7c7c' }}>Drop the files here ...</p>
          </div> :
          <div style={{ display: 'flex', cursor: 'pointer', flexWrap: 'wrap' }}>
            {
              files.map((file, index) =>
                <div key={index} style={{ border: '1px #d4d4d4 solid', padding: 20, width: 120, height: 120, textAlign: 'center', margin: 10, cursor: 'pointer' }}>
                  <img src={process.env.PUBLIC_URL + '/image.png'} alt="Logo" style={{ width: 50, maxHeight: 50, alignSelf: 'center' }} />
                  <p style={{ fontSize: 10, margin: 0, overflow: 'hidden' }}>{file.name}</p>
                </div>
              )
            }
            <div style={{ border: '1px #d4d4d4 solid', padding: 20, width: 120, height: 120, textAlign: 'center', margin: 10, cursor: 'pointer' }}>
              <img src={process.env.PUBLIC_URL + '/tambah-foto-gedung.png'} alt="Logo" style={{ width: 50, maxHeight: 50, alignSelf: 'center' }} />
              <p style={{ fontSize: 10, margin: 0, color: '#adadad' }}>Tambah foto Gedung</p>
            </div>
          </div>
      }
    </div>
  )
}

export default DragAndDrop
