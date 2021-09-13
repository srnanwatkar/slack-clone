import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, Segment } from "semantic-ui-react";
import appFirebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

function MessagesForm() {

    const messageRef = appFirebase.database().ref('messages');
    const [typedMessage, handleTypedMessages] = useState('');
    const [modal, handleModalState] = useState(false);
    const [percentUpload, handlePercentUpload] = useState(0);
    const [uploadState, handleUploadState] = useState('');

    const user = useSelector(state => state.user_reducer.currentUser);
    const channelId = useSelector(state => state.user_reducer.currentChannel.id);

    const handleSendMessage = () => {
        /* Handle message send */
        if (typedMessage.length > 0 && channelId) {
            const message = {
                timeStamp: new Date().getTime(),
                content: typedMessage,
                user: {
                    id: user.id,
                    name: user.displayName,
                    avatar: user.avatar
                }
            }

            messageRef.child(channelId).push().set(message).then(() => {
                handleTypedMessages('');
                /* Message Sent to Firebase */
                console.log('Message sent to server');
            }).catch((err) => {
                console.log('error while sending the message', err);
            });
        } else {
            console.log('Check if channel id is selected or not. Any message typed or nor')
        }
    }


    return (
        <Segment className='message_form'>
            <Input fluid size='mini' icon='search' name='messages' style={{ marginBottom: '0.7rem' }} label={<Button icon={'add'} />} labelPosition='left' onChange={(e) => handleTypedMessages(e.target.value)} value={typedMessage} placeholder='Write your messages' />

            <Button.Group icon widths={2}>
                <Button color='orange' content='Add Reply' onClick={handleSendMessage} labelPosition='left' icon='edit' disabled={typedMessage.trim().length < 1} />
                <Button color='teal' content='Upload Media' onClick={() => handleModalState(true)} labelPosition='right' icon='cloud upload' disabled={uploadState === 'uploading'} />
            </Button.Group>

            <FileModal modal={modal} closeModal={() => handleModalState(false)} percentUpload={handlePercentUpload} uploadState={handleUploadState} />
            <ProgressBar percentUpload={percentUpload} uploadState={uploadState} />
        </Segment >
    );
}

export default MessagesForm;