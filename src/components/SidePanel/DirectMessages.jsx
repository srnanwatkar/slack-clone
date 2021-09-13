import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import appFirebase from "../../firebase";

function DirectMessages() {

    const [users, handleUsers] = useState([]);
    const currentUser = useSelector(state => state.user_reducer.currentUser);
    const userRef = appFirebase.database().ref('users');
    const connectedRef = appFirebase.database().ref('.info/connected');
    const presenceRef = appFirebase.database().ref('presence');

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

    return (
        <Menu.Menu className='menu'>
            <Menu.Item>
                <span>
                    <Icon name='mail' /> DIRECT MESSAGES
                </span>{' '}
            </Menu.Item>
            {
                users.map(user => (
                    <Menu.Item key={user.uid} onClick={() => { console.log(user) }} style={{ opacity: '0.7', fontStyle: 'italic' }}>
                        <Icon name='circle' color={isUserOnline(user) ? 'green' : 'red'} />
                        @ {user.name}
                    </Menu.Item>
                ))
            }
        </Menu.Menu>
    );
}

export default DirectMessages;