import { Dimmer, Loader } from "semantic-ui-react";

function Spinner() {
    return (
        <Dimmer active>
            <Loader size="huge" content="Loading Chat App..." />
        </Dimmer>
    );
}

export default Spinner;