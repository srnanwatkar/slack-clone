import { Progress } from "semantic-ui-react";

function ProgressBar(props) {

    if (props.uploadState === 'uploading') {
        return (
            <Progress className='progress_bar' percent={props.percentUpload} progress indicating size='medium' inverted />
        );
    } else {
        return null;
    }
}

export default ProgressBar;