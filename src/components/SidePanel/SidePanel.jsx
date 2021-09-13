import { Menu } from "semantic-ui-react";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import UserPanel from "./UserPanel";

function SidePanel() {
    return (
        <Menu
            size='large'
            inverted
            fixed='left'
            vertical
            style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
        >
            <UserPanel />
            <Channels />
            <DirectMessages />
        </Menu>
    );
}

export default SidePanel;