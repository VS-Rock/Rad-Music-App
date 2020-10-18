import Axios from 'axios';
import React, { useState } from 'react';
import {
  Container, Col, Row,
  Button, ButtonGroup, InputGroup,
  FormControl, DropdownButton, Dropdown,
  FormLabel, Form,
} from 'react-bootstrap';

const SetupProfile = ({
  view, setView, setUser, user, setGenre,
}) => {
  const [userName, setUserName] = useState('');
  const [setupGenre, setSetupGenre] = useState('Favorite genre');
  const [profilePic, setProfilePic] = useState('');

  const submit = () => {
    event.preventDefault();
    Axios.post('/api/profile/create', {
      userName,
      setupGenre,
      user,
    })
      .then((response) => {
        window.alert('Successfully registered!');
        setUser(userName);
        setGenre(JSON.parse(response.config.data).setupGenre);
        setView('Home');
      })
      .catch((error) => {
        window.alert('Username Taken!');
        console.error(error);
      });
  };

  return (

    <div
      as={Container}
      style={{
      // border: 'solid 2px black',
        padding: '20px',
      }}
    >
      <Col>
        <Row>
          <div>
            <Form>
              <Form.Group>
                <div>
                  <FormLabel column="lg">Choose your username!</FormLabel>
                  <InputGroup>
                    <FormControl
                      placeholder="Enter here!"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      onChange={(e) => setUserName(e.target.value)}
                    />

                    <DropdownButton
                      as={InputGroup.Append}
                      variant="outline-secondary"
                      title={setupGenre}
                      id="input-group-dropdown-2"
                      onSelect={(e) => setSetupGenre(e)}
                    >
                      <Dropdown.Item eventKey="Alternative" href="#">Alternative</Dropdown.Item>
                      <Dropdown.Item eventKey="Blues" href="#">Blues</Dropdown.Item>
                      <Dropdown.Item eventKey="Classical" href="#">Classical</Dropdown.Item>
                      <Dropdown.Item eventKey="Easy Listening" href="#">Easy Listening</Dropdown.Item>
                      <Dropdown.Item eventKey="Electronic" href="#">Electronic</Dropdown.Item>
                      <Dropdown.Item eventKey="Hip-Hop/Rap" href="#">Hip-Hop/Rap</Dropdown.Item>
                      <Dropdown.Item eventKey="K-Pop" href="#">K-Pop</Dropdown.Item>
                      <Dropdown.Item eventKey="Pop" href="#">Pop</Dropdown.Item>
                      <Dropdown.Item eventKey="Rock" href="#">Rock</Dropdown.Item>
                      <Dropdown.Item eventKey="R&B/Soul" href="#">R&B/Soul</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="https://i.imgur.com/7JQkwUo.png" target="_blank">Click Here to check where you fall under</Dropdown.Item>
                    </DropdownButton>
                  </InputGroup>
                </div>
                <div>
                  <ButtonGroup>
                    <Button variant="success" type="submit" onClick={() => submit()}>Register</Button>
                  </ButtonGroup>
                </div>
              </Form.Group>
            </Form>
          </div>
        </Row>
      </Col>
    </div>
  );
};

export default SetupProfile;
