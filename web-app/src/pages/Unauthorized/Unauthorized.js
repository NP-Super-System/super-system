import { useNavigate } from 'react-router-dom';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';
import PageContainer from '../../layout/PageContainer';
import styles from './Unauthorized.module.css';
import { Button } from 'react-bootstrap';


const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-2);

    return (
        <PageContainer>
            <Button 
                variant='outline-primary' 
                className={styles.backBtn}
                onClick={goBack}>
                <BsFillArrowLeftCircleFill />
            </Button>
            <div>
                <h1 className={styles.warning}>You do not have access to this page.</h1>
            </div>
        </PageContainer>
    )
}

export default Unauthorized;