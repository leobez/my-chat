import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { useContext } from 'react';
import SnackbarContext, { SnackbarContextType } from '../context/SnackbarContext';
import { Alert } from '@mui/material';


const SnackBar = () => {

    const {open, message, severity, handleSnackbar} = useContext(SnackbarContext) as SnackbarContextType

    const handleClose = (
        // @ts-ignore
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        handleSnackbar({open: false, message: '', severity: ''});
      };

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        >
            <Alert
            onClose={handleClose}
            severity={severity}
            variant='filled'
            sx={{ width: '100%', fontWeight: 'bold' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBar