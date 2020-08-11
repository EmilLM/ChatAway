import { Formik, Form, useField } from 'formik';
import {Checkbox, FormControlLabel} from "@material-ui/core";

const FormikCheckbox = ({ children, ...props }) => {
    // We need to tell useField what type of input this is
    // since React treats radios and checkboxes differently
    // than inputs/select/textarea.
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    return (
      <>
        <FormControlLabel
          control={
            <Checkbox {...field} {...props} color="primary"/>
          }
          label={children}
        />
      </>
    );
  };

  export default FormikCheckbox;

//   <label className="checkbox">
//   <input type="checkbox" {...field} {...props} />
//   {children}
// </label>
// {meta.touched && meta.error ? (
//   <div className="error">{meta.error}</div>
// ) : null}