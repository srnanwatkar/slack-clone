import { useState } from "react";
import { Button, Icon, Input, Modal } from "semantic-ui-react";
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import appFirebase from "../../firebase";
import { useSelector } from "react-redux";

function FileModal(props) {

    const [file, handleFileChange] = useState(null);
    const storageRef = appFirebase.storage().ref();
    const messageRef = appFirebase.database().ref('messages');
    const privateMessageRef = appFirebase.database().ref('privateMessages');

    const channelId = useSelector(state => state.channel_reducer.currentChannel.id);
    const privateChannel = useSelector(state => state.channel_reducer.isPrivateChannel);
    const user = useSelector(state => state.user_reducer.currentUser);

    const filePathName = `${uuidv4()}.jpg`;
    const fileType = ['image/jpeg', 'image/png']

    const getFilePath = () => {
        if (privateChannel) {
            return `chat/private-${channelId}/` + filePathName;
        } else {
            return `chat/path/` + filePathName;
        }
    }

    const sendFile = (e) => {
        e.preventDefault();

        if (file !== null && channelId !== null) {
            if (fileType.includes(mime.lookup(file.name))) {
                const metadata = { contentType: mime.lookup(file.name) };
                const uploadTask = storageRef.child(getFilePath()).put(file, metadata);

                /* Uploading State */
                props.uploadState('uploading');

                /* Close the modal */
                props.closeModal();

                uploadTask.on('state_change', snap => {
                    const percentUpload = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    props.percentUpload(percentUpload);
                    console.log(percentUpload)

                    if (percentUpload === 100) {
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            sendFileMessage(downloadURL)
                        })
                    }
                });
            }
        }
    }

    const sendFileMessage = (fileUrl) => {

        if (fileUrl !== null) {
            const message = {
                timeStamp: new Date().getTime(),
                image: fileUrl,
                user: {
                    id: user.id,
                    name: user.displayName,
                    avatar: user.avatar
                }
            }

            /* Get the reference for private or group message reference */
            const ref = getMessageRef();

            ref.child(channelId).push().set(message).then(() => {
                handleFileChange(null);
                /* Uploading State */
                props.uploadState('done')

                /* Message Sent to Firebase */
                console.log('File sent to server');
            }).catch((err) => {
                console.log('error while sending the file', err);
            });
        }
    }

    const getMessageRef = () => {
        return privateChannel ? privateMessageRef : messageRef;
    }

    return (
        <Modal basic open={props.modal} onClose={props.closeModal}>
            <Modal.Header>
                Select a file to upload
            </Modal.Header>
            <Modal.Content>
                <Input onChange={(e) => handleFileChange(e.target.files[0])} fluid label='File types: jpg, png' name='file' type='file' />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={(e) => sendFile(e)} color='green' inverted>
                    <Icon name='checkmark' /> Send
                </Button>
                <Button color='red' onClick={props.closeModal} inverted>
                    <Icon name='remove' /> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default FileModal;