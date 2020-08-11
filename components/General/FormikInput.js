import React from 'react';
import { useField } from 'formik';
import {TextField} from "@material-ui/core"


const FormikInput = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and also replace ErrorMessage entirely.
    const [field, meta] = useField(props);

    return (
      <>
        <TextField {...field} {...props} 
          variant="outlined"
          error={Boolean(meta.touched && meta.error)} 
          label={meta.touched && meta.error?meta.error:label}
          fullWidth
          size="small"
          // helperText={meta.error}    

          // addAdorment={addAdorment} 
          // props.addAdorment=
          />
      </>
    );
};

export default FormikInput;