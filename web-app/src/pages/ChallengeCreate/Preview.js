import React, {useState, useEffect} from 'react';
import { Image } from 'react-bootstrap';

import styles from './Preview.module.css';

const Preview = props => {

    const { qindex, previews } = props;

    const [objectUrl, setObjectUrl] = useState('');

    useEffect(()=>{
        const newObjectUrl = previews.filter(preview => preview?.qindex === qindex)[0]?.objectUrl;
        console.log(previews, qindex, previews.filter(preview => preview?.qindex === qindex)[0]);
        setObjectUrl(newObjectUrl);
    }, [previews]);

    return (
        <Image 
            src={objectUrl || ''}
            className={styles.preview}/>
    )
}

export default Preview;