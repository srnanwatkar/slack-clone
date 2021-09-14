import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import { SET_CHANNEL_ID, SET_PRIVATE_CHANNEL } from "../../actions/types";
import appFirebase from "../../firebase";

function DirectMessages() {

    const [users, handleUsers] = useState([]);
    const [activeChannel, handleActiveChannel] = useState('');
    const currentUser = useSelector(state => state.user_reducer.currentUser);
    const privateChannel = useSelector(state => state.channel_reducer.isPrivateChannel);

    const userRef = appFirebase.database().ref('users');
    const connectedRef = appFirebase.database().ref('.info/connected');
    const presenceRef = appFirebase.database().ref('presence');

    const dispatch = useDispatch();

    useEffect(() => {
        let loadedUsers = [];
        userRef.on('child_added', snap => {
            if (currentUser.id !== snap.key) {
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
            }
            handleUsers(loadedUsers);
        });
    }, [JSON.stringify(users)]);

    useEffect(() => {
        connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = presenceRef.child(currentUser.id);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if (err !== null) {
                        console.log(err);
                    }
                });
            }
        });

        /* Child added trigger */
        presenceRef.on('child_added', snap => {
            if (currentUser.id !== snap.key) {
                addStatusToUser(snap.key);
            }
        });

        /* Child removed trigger */
        presenceRef.on('child_removed', snap => {
            if (currentUser.id !== snap.key) {
                addStatusToUser(snap.key, false);
            }
        });

    }, [JSON.stringify(users)]);

    const addStatusToUser = (userId, connected = true) => {
        const updatedUsers = users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`
            }
            return acc.concat(user);
        }, [])
        handleUsers(updatedUsers)
    }

    const isUserOnline = (user) => user.status === 'online';

    const handleChangeUserChannel = (user) => {
        const channelId = getChannelId(user.uid);

        const channelData = {
            id: channelId,
            name: user.name
        }

        /* Set ChannelData */
        dispatch({
            type: SET_CHANNEL_ID,
            payload: channelData
        });

        /* Set Private Channel */
        dispatch({
            type: SET_PRIVATE_CHANNEL,
            payload: true
        });

        /* Make active Channel */
        handleActiveChannel(user.uid);
    };

    const getChannelId = (userId) => {
        return userId < currentUser.id ? `${userId}/${currentUser.id}` : `${currentUser.id}/${userId}`;
    }

    return (
        <Menu.Menu className='menu'>
            <Menu.Item>
                <span>
                    <Icon name='mail' /> DIRECT MESSAGES
                </span>{' '}
            </Menu.Item>
            {
                users.map(user => (
                    <Menu.Item key={user.uid} active={user.uid === activeChannel && privateChannel} onClick={() => handleChangeUserChannel(user)} style={{ opacity: '0.7', fontStyle: 'italic' }}>
                        <Icon name='circle' color={isUserOnline(user) ? 'green' : 'red'} />
                        @ {user.name}
                    </Menu.Item>
                ))
            }
        </Menu.Menu>
    );
}

export default DirectMessages;