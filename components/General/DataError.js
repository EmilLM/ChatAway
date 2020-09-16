import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';

const DataError = () => {
    
    return ( 
        <div className="dataError">
            <ErrorIcon/>
            <h2>Something went wrong!</h2>
            <h3>Please refresh the page or try again later!</h3>
        </div>
    );
}
 
export default DataError;