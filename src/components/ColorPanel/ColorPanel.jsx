import { Button, Divider, Menu, Sidebar } from "semantic-ui-react";

function ColorPanel() {
    return (
        <Sidebar as={Menu} inverted vertical visible width='very thin'>
            <Divider />
            <Button icon='add' size='small' color='blue' />
        </Sidebar>
    );
}

export default ColorPanel;