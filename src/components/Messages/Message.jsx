import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

function Message(props) {

    const isOwnMessage = (id) => {
        return id === props.user.id ? 'message_self' : 'message_other';
    }

    const isImage = (msg) => {
        return msg.hasOwnProperty('image') && !msg.hasOwnProperty('content');
    }

    return (
        <Comment>
            <Comment.Avatar src={props.data.user.avatar} />
            <Comment.Content className={isOwnMessage(props.data.user.id)}>
                <Comment.Author as='a'>{props.data.user.name}</Comment.Author>
                <Comment.Metadata>{moment(props.data.timeStamp).fromNow()}</Comment.Metadata>
                <Comment.Text>{props.data.content}</Comment.Text>
                {
                    isImage(props.data) ? <Image src={props.data.image} className='message_image' /> : ''
                }
            </Comment.Content>
        </Comment>
    );
}

export default Message;