import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Icon, Input, Menu, Modal } from "semantic-ui-react";
import { LOADER_STATE, SET_CHANNEL_ID } from "../../actions/types";
import appFirebase from "../../firebase";

function Channels() {

    const dispatch = useDispatch();

    const [channelName, handleChannelName] = useState('');
    const [channelDetails, handleChannelDetails] = useState('');
    const [loadedChannels, handleChannelArray] = useState([]);
    const [modal, handleModalState] = useState(false);
    const channelsRef = appFirebase.database().ref('channels')

    const handleChannelAdd = (event) => {
        event.preventDefault();

        if (channelName.length > 0) {
            /* Loader Initial */
            dispatch({
                type: LOADER_STATE,
                payload: true
            });

            const key = channelsRef.push().key;
            const channelsObj = {
                id: key,
                name: channelName,
                details: channelDetails,
            }

            channelsRef.child(key).update(channelsObj).then(() => {
                /* Reset the state */
                handleChannelDetails('');
                handleChannelName('');
                handleModalState(false);

                console.log('Channel Added');

                /* Loader Initial */
                dispatch({
                    type: LOADER_STATE,
                    payload: false
                });
            }).catch((err) => {
                console.log('Error while adding Channel', err)
            })
        }
    }

    const channelList = [];
    useEffect(() => {
        /* Function for retrieving the channels from firebase */
        channelsRef.on('child_added', snap => {
            channelList.push(snap.val());
            handleChannelArray(() => channelList);
        });

    }, [JSON.stringify(loadedChannels)]);

    const handleChannelId = (channel) => {
        dispatch({
            type: SET_CHANNEL_ID,
            payload: { id: channel.id, name: channel.name }
        })
    }

    const renderChannels = () => {
        return loadedChannels.map((item) => {
            return (
                <Menu.Item key={item.id} onClick={() => handleChannelId(item)} name={item.name} style={{ opacity: '0.7rem' }}>
                    # {item.name}
                </Menu.Item>
            )
        })
    }

    return (
        <>
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='exchange' /> CHANNELS
                    </span>{' '}
                    ({loadedChannels.length})<Icon name='add' onClick={() => handleModalState(true)} />
                </Menu.Item>
                {
                    renderChannels()
                }
            </Menu.Menu>

            <Modal basic open={modal} onClose={() => handleModalState(false)}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <Input fluid label='Name of Channel' name='channelName' value={channelName} onChange={e => handleChannelName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <Input fluid label='About the Channel' name='channelDetails' value={channelDetails} onChange={e => handleChannelDetails(e.target.value)} />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color='green' onClick={(e) => handleChannelAdd(e)} inverted>
                        <Icon name='checkmark' /> Add
                    </Button>
                    <Button color='red' inverted onClick={() => handleModalState(false)}>
                        <Icon name='remove' /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default Channels;