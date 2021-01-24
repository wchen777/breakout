import React, { useState } from 'react';
import { Button, Container, Row, Form } from 'react-bootstrap'


export default function JoinForm({ history, setShowForm, setID }){
    const [form, setForm] = useState('');
    return (
      <Container className="pt-5 mt-5">
        <Row className='justify-content-center mt-5'> 
        <h1 className="text-center pb-4">Breakout!</h1>
        <div className="col-sm-12 text-center">

        <Form>
            <Form.Group>
            <Form.Label> 
                Enter a room key:
            </Form.Label>
            <Form.Control type="text" 
            value={form}
            onChange={e => setForm(e.target.value)}/>
            </Form.Group>

        </Form>
          <Button
            variant="danger" size="lg" type="submit" 
            className="mr-3"
            onClick={() => {
              setID(form)
              setShowForm(false)
            }}
          >
            Join!
          </Button>

          <Button
            variant="danger" size="lg" type="submit"
            className="ml-3"
            onClick={() => {
              history.push('/')
            }}
          >
            Back
          </Button>
          
        </div>
        </Row>
      </Container>
    )
}