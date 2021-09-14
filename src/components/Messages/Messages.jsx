import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Comment, Segment } from "semantic-ui-react";
import appFirebase from "../../firebase";
import Message from "./Message";
import MessagesForm from "./MessageForm";
import MessagesHeader from "./MessageHeader";

function Messages() {

    const [loadedMessages, handleLoadedMessage] = useState([]);
    const [uniqueGroupUsers, handleGroupUserCount] = useState(0);
    const [searchedText, handleSearchedText] = useState('');
    const [searchedResults, handleSearchedResults] = useState([]);
    const [searchLoading, handleSearchLoading] = useState(false);

    const messageRef = appFirebase.database().ref('messages');
    const privateMessageRef = appFirebase.database().ref('privateMessages');

    const channelId = useSelector(state => state.channel_reducer.currentChannel.id);
    const user = useSelector(state => state.user_reducer.currentUser);
    const privateChannel = useSelector(state => state.channel_reducer.isPrivateChannel);

    const tempMessages = [];

    useEffect(() => {
        /* Function for retrieving the message wrt channelId from firebase */
        if (channelId) {
            handleLoadedMessage([]);

            /* Get the reference for private or group message reference */
            const ref = getMessageRef();

            ref.child(channelId).on('child_added', snap => {
                tempMessages.push(snap.val())
                handleLoadedMessage(() => tempMessages);
            });
        }

    }, [JSON.stringify(tempMessages), channelId]);

    const getMessageRef = () => {
        return privateChannel ? privateMessageRef : messageRef;
    }

    useEffect(() => {
        const getUniqueUserCount = loadedMessages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name)
            }
            return acc;
        }, []);

        handleGroupUserCount(getUniqueUserCount.length);
    })

    const handleDisplayMessages = () => {
        const messageToIterate = (searchedResults.length !== 0 || searchedText.length > 2) ? searchedResults : loadedMessages;

        return messageToIterate.length > 0 && messageToIterate.map((item, key) => {
            return <Message key={key} data={item} user={user} />
        })
    }

    const handleSearchChanged = (e) => {
        e.preventDefault();
        if (e.target.value.trim().length > 2) {
            handleSearchedText(e.target.value.trim());
        } else {
            handleSearchedText('');
        }
    }

    useEffect(() => {
        /* Search the text in the messages sent */
        searchMessage();
    }, [searchedText])

    const searchMessage = () => {
        if (searchedText.length > 2) {
            /* Loader for search box */
            handleSearchLoading(true);

            const regex = new RegExp(searchedText, 'gi');

            const searchedMessages = loadedMessages.reduce((acc, message) => {
                /* Filter for user or kmessage */
                if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
                    acc.push(message)
                }
                return acc;
            }, []);

            /* Timeout for loader to be visible */
            setTimeout(() => {
                handleSearchedResults(searchedMessages);
                handleSearchLoading(false);
            }, 1000);
        } else {
            handleSearchedResults([]);
        }
    }

    return (
        <>
            <MessagesHeader uniqueGroupUsers={uniqueGroupUsers} handleSearchText={handleSearchChanged} searchLoading={searchLoading} />

            <Segment>
                <Comment.Group className='messages'>
                    {handleDisplayMessages()}
                </Comment.Group>
            </Segment>

            <MessagesForm />
        </>
    );
}

export default Messages;