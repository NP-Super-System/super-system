import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { Button } from 'react-bootstrap';
import { BsDownload } from 'react-icons/bs';

import styles from './File.module.css';

const File = props => {

    const { fileName, fileKey, fileExt } = props;

    const saveFile = (fileName, fileKey) => {
        saveAs(
            `http://localhost:5000/s3/file/${fileKey}`,
            fileName,
        );
    }

    const [hover, setHover] = useState(false);

    return (
        <Button 
            className={styles.file}
            title={fileName}
            variant='none'
            onClick={() => saveFile(fileName, fileKey)}
            onMouseEnter={e => setHover(true)}
            onMouseLeave={e => setHover(false)}>

            <div className={styles.fileicon}>
            {
                hover ?
                <BsDownload />
                :
                <FileIcon 
                    extension={fileExt}
                    {...defaultStyles[fileExt]}/>
            }
            </div>
            <span className={styles.filename}>{fileName}</span>
            
        </Button>
    )
}

export default File;