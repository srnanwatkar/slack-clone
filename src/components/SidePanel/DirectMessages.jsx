import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import appFirebase from "../../firebase";

function DirectMessages() {

    const currentUser = useSelector(state => state.user_reducer.currentUser);
    const userRef = appFirebase.database().ref('users');
    const connectedRef = appFirebase.database().ref('.info/connected');
    const [users, handleUsers] = useState([]);

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

        });
    });

    return (
        <Menu.Menu className='menu'>
            <Menu.Item>
                <span>
                    <Icon name='mail' /> DIRECT MESSAGES
                </span>{' '}
            </Menu.Item>
        </Menu.Menu>
    );
}

export default DirectMessages;