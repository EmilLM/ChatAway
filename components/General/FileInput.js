
import { useField } from 'formik';

const FileInput = ({label, ...props}) => {
  const [field, meta] = useField(props);

  return ( 
    <label htmlFor={props.id || props.name}>{label}
        <input {...field} {...props} accept="image/*"/>
    </label>
  );
}
 
export default FileInput;


  