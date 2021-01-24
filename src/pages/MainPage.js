import React from 'react';
import { Button, Container, Row } from 'react-bootstrap'

export default function MainPage(props){
    return (
      <Container className=" align-items-center mt-5 pt-5">
        <Row className='justify-content-center mt-5 '> 
        <h1 className="text-center pb-4">Breakout!</h1>
        <div className="col-sm-12 text-center">

          <Button
            variant="danger" size="lg" type="submit" 
            className=""
            onClick={() => {
              props.history.push('/create-room')
            }}
          >
            Create Room
          </Button>
          <br/>
          <br/>
          <Button
            variant="danger" size="lg" type="submit" 
            onClick={() => {
              props.history.push('/join-room')
            }}
          >
            Join Room
          </Button>

        </div>
        </Row>
      </Container>
    )
}

