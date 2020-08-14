import { useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';
import { post } from 'axios';

const StyledDiv = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${props => props.isDragActive ? "1px dotted green" : "1px dotted gray"}; 
`;
// const CHUNK_SIZE = 500 * 1024;
// const MAX_THREAD_COUNT = 10;
// let activeConnections = 0;
// let chunksQueue = null;

// function sendNext(file) {
//     if (activeConnections >= MAX_THREAD_COUNT) {
//         console.log("Hit max thread count");
//         return;
//     }

//     if (!chunksQueue.length) {
//         if (!activeConnections) {
//             console.log("All parts uploaded");
//         }
//         return;
//     }

//     const chunkId = chunksQueue.pop();
//     const begin = chunkId * CHUNK_SIZE;
//     const chunk = file.slice(begin, begin + CHUNK_SIZE);
//     activeConnections += 1;
//     upload(chunk, chunkId, file)
//         .then(() => {
//             console.log("releasing activeConnection")
//             activeConnections -= 1;
//             sendNext(file);
//         })
//         .catch((error) => {
//             console.log(error);
//             activeConnections -= 1;
//             chunksQueue.push(chunkId);
//         });

//     sendNext(file);
// }

// function upload(chunk, chunkId, file) {
//   return new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.open("post", "/api/upload");

//       xhr.setRequestHeader("Content-Type", "application/octet-stream");
//       xhr.setRequestHeader("X-Chunk-Id", chunkId);
//       xhr.setRequestHeader("X-Content-Id", "NEEDTODEFINE");
//       // Size and real name of whole file, not just a chunk
//       xhr.setRequestHeader("X-Content-Length", file.size);
//       xhr.setRequestHeader("X-Content-Name", file.name);

//       xhr.onreadystatechange = () => {
//         if (xhr.readyState === 4 && xhr.status === 200) {
//           console.log("finished sending");
//           resolve();
//         }
//       };

//       xhr.onerror = reject;

//       xhr.send(chunk);
//       console.log('sending')
//   });
// }

export default function MyDropzone() {
  
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const url = 'api/upload';
    const formData = new FormData();
    formData.append('file',file)

    const config = {
      headers: {
        "X-Content-Id": "NEEDTODEFINE",
        'content-type': 'multipart/form-data'
      }
    }
    // post(url, formData, config)
    fetch(url, {
      method: 'POST',
      body: formData
    }).then((response) => {
      return response.json();
    }).then((response) => {
      debugger;
    }).catch((error) => {
      console.error(error);
    });
    // const chunksQuantity = Math.ceil(file.size / CHUNK_SIZE);
    // console.log("Starting upload with quantity:" + chunksQuantity);
    // chunksQueue = new Array(chunksQuantity).fill().map((_, index) => index).reverse();
    // sendNext(file)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <StyledDiv isDragActive={isDragActive} {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </StyledDiv>
  )
}
