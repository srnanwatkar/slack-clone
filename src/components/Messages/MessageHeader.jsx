import { useSelector } from "react-redux";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

function MessagesHeader(props) {

    const channelName = useSelector(state => state.channel_reducer.currentChannel.name);
    const privateChannel = useSelector(state => state.channel_reducer.isPrivateChannel);

    return (
        <Segment clearing>
            <Header fluid='true' as='h2' floated='left' style={{ marginBotton: 0 }}>
                <span>
                    {channelName ? `${privateChannel ? '@ ' : '# '}${channelName}` : 'Channel'}
                    <Icon name={'star outline'} color='black' />
                </span>
                <Header.Subheader>
                    {(props.uniqueGroupUsers !== 0 && !privateChannel) ? `${props.uniqueGroupUsers} ${props.uniqueGroupUsers === 1 ? 'User' : 'Users'}` : ''}
                </Header.Subheader>
            </Header>

            <Header floated='right'>
                <Input size='mini' icon='search' name='searchTerm' placeholder='Search Messages' onChange={(e) => props.handleSearchText(e)} loading={props.searchLoading} />
            </Header>
        </Segment>
    );
}

export default MessagesHeader;