import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import appFirebase from '../../firebase';


function Login() {

    const [email, handleEmail] = useState('');
    const [password, handlePassword] = useState('');

    const handleOnLogin = (event) => {
        event.preventDefault();

        if (password.length > 0 && email.length > 0) {
            appFirebase.auth().signInWithEmailAndPassword(email, password)
                .then((userLoggedInResponse) => {
                    console.log(userLoggedInResponse)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    return (
        <Grid textAlign="center" verticalAlign="middle" className="initClass">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h1" icon color="violet" textAlign="center">
                    <Icon name="code branch" color="violet" />
                    Login to DevChat
                </Header>
                <Form size="large" onSubmit={handleOnLogin}>
                    <Segment stacked>
                        <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email" type="email" value={email} onChange={e => handleEmail(e.target.value)} />
                        <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" value={password} onChange={e => handlePassword(e.target.value)} />

                        <Button color="violet" fluid size="large" type="submit">Login</Button>
                    </Segment>
                </Form>

                <Message>Don't have an account? <Link to="/register"> Register</Link></Message>
            </Grid.Column>
        </Grid>
    );
}

export default Login;
