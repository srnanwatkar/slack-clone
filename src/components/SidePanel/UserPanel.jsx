import { useSelector } from "react-redux";
import { Dropdown, Grid, Header, Icon, Image } from "semantic-ui-react";
import appFirebase from "../../firebase";

function UserPanel() {

    const user = useSelector(state => state.user_reducer.currentUser);

    /* Handle Dropdown options */
    const handleOptions = () => [
        {
            key: 'signIn',
            text: <span>Signed in as <strong> {user.displayName} </strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signOut',
            text: <span onClick={handleSignOut}>Sign Out</span>
        }
    ];

    /* Sign Out User function */
    const handleSignOut = () => {
        /* Sign out function here */
        appFirebase.auth().signOut().then(() => {
            console.log('signed Out!')
        })
    }

    return (
        <Grid style={{ background: '#4c3c4c' }}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2rem', margin: 0 }}>
                    {/* App Header */}
                    <Header inverted floated='left' as='h2'>
                        <Icon name='code' />
                        <Header.Content>
                            DevChat
                        </Header.Content>
                    </Header>
                </Grid.Row>

                {/* User Dropdown */}
                <Header style={{ padding: '.25rem' }} as='h4' inverted>

                    <Dropdown trigger={
                        <span>
                            <Image src={user.avatar} spaced='right' avatar />
                            {user.displayName}
                        </span>
                    } options={handleOptions()} />
                </Header>
            </Grid.Column>
        </Grid>
    );
}

export default UserPanel;