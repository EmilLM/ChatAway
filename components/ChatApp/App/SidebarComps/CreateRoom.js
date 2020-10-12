import React, {useState, useEffect} from 'react';
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import FormikInput from "../../../General/FormikInput";
import FormikCheckbox from "../../../General/FormikCheckbox"
import {Button, CircularProgress} from '@material-ui/core';
import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';


const CreateRoom = ({toggleModal, setToggleModal}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [roomError, setRoomError] = useState(null);

    const createRoom = async (name, description, isPrivate) => {
        setIsLoading(true);
        try {
            const res= await axios.post('/api/rooms', {
                name,
                description,
                isPrivate
            });
            setRoomData(res.data);
            setIsLoading(false);
            console.log('New Room is', roomData);
        } catch(err) {
            console.log(err.response)
            setRoomError(err.response);
            setIsLoading(false);
        }
        mutate('/api/rooms')
        trigger('/api/rooms')
    }
    
    useEffect( () => {
        if (roomData)  setToggleModal(!toggleModal)
    }, [roomData])
    return (
        <>
            <div>Rooms are where you chat with other users. 
                They're best when organized around a topic.
            </div> 
            <Formik initialValues={{
                name: '',
                description: '',
                isPrivate: false
                }}
                validationSchema={Yup.object({
                name: Yup.string()
                    .required('Required')
                    .max(25, 'Room must be shorter than 26 characters!')
                    .min(2, 'Room name must be 2+ characters long!'),
                description: Yup.string()
                    .max(200, "Description must be shorter than 200 characters!"),
                isPrivate: Yup.boolean()
                })}
                onSubmit={(values, { resetForm}) => {
                    createRoom(values.name, values.description, values.isPrivate);
                    resetForm();     
                }}
            >
                <Form className="roomForm">
                    <FormikInput label="Room name"
                        name="name" type="text" autoComplete="off"
                    />
                    <FormikInput label="Description(optional)"
                        name="description" type="text" autoComplete="off"
                    />
                    <FormikCheckbox name="isPrivate">Make private</FormikCheckbox>

                    {roomError?<small>{roomError.data.message}!</small>:null}

                    <Button variant="contained" color="primary" type="submit" className="customButton" disabled={isLoading}>
                        {!isLoading?"Submit":<CircularProgress style={{color:"white"}} size={25.5}/>}
                    </Button>
                    
                </Form>
            </Formik>
        </>
     );
}
 
export default CreateRoom;