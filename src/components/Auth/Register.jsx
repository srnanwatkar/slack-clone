import md5 from 'md5';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import appFirebase from '../../firebase';


function Register() {

	const [username, handleUsername] = useState('');
	const [email, handleEmail] = useState('');
	const [password, handlePassword] = useState('');
	const [passwordConfirmation, handlePasswordConfirmation] = useState('');
	const userRef = appFirebase.database().ref('users');

	const handleOnSubmit = (event) => {
		event.preventDefault();

		/* Check if password and confirmation password are same or not */
		if (password.length > 0 && username.length > 0) {
			appFirebase.auth().createUserWithEmailAndPassword(email, password).then((userCreated) => {
				console.log(userCreated);
				userCreated.user.updateProfile({
					displayName: username,
					photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=identicon`
				}).then(() => {
					userRef.child(userCreated.user.uid).set({
						name: userCreated.user.displayName,
						avatar: userCreated.user.photoURL
					})
				}).then(() => {
					console.log('User saved in database')
				});
			})
		}
	}

	return (
		<Grid textAlign="center" verticalAlign="middle" className="initClass">
			<Grid.Column style={{ maxWidth: 450 }}>
				<Header as="h1" icon color="orange" textAlign="center">
					<Icon name="puzzle piece" color="orange" />
					Register for DevChat
				</Header>
				<Form size="large" onSubmit={handleOnSubmit}>
					<Segment stacked>
						<Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="Username" type="text" value={username} onChange={e => handleUsername(e.target.value)} />
						<Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email" type="email" value={email} onChange={e => handleEmail(e.target.value)} />
						<Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="Password" type="password" value={password} onChange={e => handlePassword(e.target.value)} />
						<Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" type="password" value={passwordConfirmation} onChange={e => handlePasswordConfirmation(e.target.value)} />

						<Button color="orange" fluid size="large" type="submit">Register</Button>
					</Segment>
				</Form>

				<Message>Already a User? <Link to="/login"> Login</Link></Message>
			</Grid.Column>
		</Grid>
	);
}

export default Register;
