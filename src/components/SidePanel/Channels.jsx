import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Icon, Input, Label, Menu, Modal } from "semantic-ui-react";
import { LOADER_STATE, SET_CHANNEL_ID, SET_PRIVATE_CHANNEL } from "../../actions/types";
import appFirebase from "../../firebase";

function Channels() {

    const dispatch = useDispatch();

    const [channel, handleChannel] = useState(null);
    const [channelName, handleChannelName] = useState('');
    const [channelDetails, handleChannelDetails] = useState('');
    const [loadedChannels, handleChannelArray] = useState([]);
    const [notifications, handleNotifications] = useState([]);
    const [modal, handleModalState] = useState(false);

    const channelsRef = appFirebase.database().ref('channels');
    const messageRef = appFirebase.database().ref('messages');

    const channelId = useSelector(state => state.channel_reducer.currentChannel.id);

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
            addNotificationListener(snap.key);
        });

    }, [JSON.stringify(loadedChannels)]);

    const addNotificationListener = (channelId) => {
        messageRef.child(channelId).on('value', snap => {
            if (channel) {
                handleChannelNotification(channelId, channel.id, notifications, snap)
            }
        });
    }

    const handleChannelNotification = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId);

        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0,
            })
        }

        handleNotifications(notifications)
    }

    const handleChannelId = (channel) => {
        /* Reset Notification */
        clearNotification();

        dispatch({
            type: SET_CHANNEL_ID,
            payload: { id: channel.id, name: channel.name }
        })

        /* Set Private Channel */
        dispatch({
            type: SET_PRIVATE_CHANNEL,
            payload: false
        });

        handleChannel(channel);
    }

    const clearNotification = () => {
        let index = notifications.findIndex(notification => notification.id === channel.id);

        if (index !== -1) {
            let updatedNotification = [...notifications];
            updatedNotification[index].total = notifications[index].lastKnownTotal;
            updatedNotification[index].count = 0;

            handleNotifications(updatedNotification);
        }
    }

    const getNotificationCount = channel => {
        let count = 0;

        notifications.forEach(notification => {
            if (notification.id === channel.id) {
                count = notification.count
            }
        });

        return count > 0 ? count : null;
    }

    const renderChannels = () => {
        return loadedChannels.map((item) => {
            return (
                <Menu.Item key={item.id} active={channelId === item.id} onClick={() => handleChannelId(item)} name={item.name} style={{ opacity: '0.7rem' }}>
                    {
                        getNotificationCount(item) && (
                            <Label color='red'>
                                {getNotificationCount(item)}
                            </Label>
                        )
                    }

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