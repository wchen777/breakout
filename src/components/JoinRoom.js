import { useEffect, useRef, useState } from 'react';
import { Container, Col, Row, Button, Form } from 'react-bootstrap';


export default function JoinRoom({ ID }) {
    const [video, setVideo] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [notes, setNotes] = useState('')
    const [showCanvas, setShowCanvas] = useState(false);

    const videoRef = useRef({});
    const audioRef = useRef(null);
  
    useEffect(() => {
      import('peerjs').then((module) => {
        const Peer = module.default;
        const peer = new Peer({
          host: 'polar-escarpment-94286.herokuapp.com',
          port: process.env.NODE_ENV === 'development' ? 80 : 443,
        });
        peer.on('open', (id) => {
          console.log('my peer id:', id);
  
          navigator.mediaDevices
            .getUserMedia({
              video: true,
            })
            .then((stream) => {
              videoRef.current.srcObject = stream;
            });
          navigator.mediaDevices
            .getUserMedia({
              audio: true,
            })
            .then((stream) => {
              console.log('calling', ID);
              peer.call(ID, stream);
            });
  
          console.log('connecting to', ID);
          const conn = peer.connect(ID);
          conn.on('open', () => {
            console.log('connection opened');
            conn.on('data', (data) => {
            //   var stream = data.captureStream(25);
            //   recVidRef.current.srcObject = stream;
            // console.log(data)
            setVideo(data.image)
            setCanvas(data.canvas)
            //recVidRef.current = data;
            });
          });

         // conn.send(videoRef.current.srcObject)
          const canvas = document.createElement('canvas');
          canvas.width = 225;
          canvas.height = 168.75;
          const ctx = canvas.getContext('2d');
  
          setInterval(() => {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            //conn.send(getASCII(canvas));
            // conn.send(videoRef.current)
            const image = canvas.toDataURL()
            conn.send({image: image})
          }, 100);

        });
      });
    }, []);

    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([document.getElementById('notes').value],    
                    {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "notes.txt";
        document.body.appendChild(element);
        element.click();
      }

    return (
        <Container className="m-0 p-0">
            <Row>
            <Col className="m-0 p-0">
                <Row className="m-0 p-0">
                <video
                autoPlay
                className="mb-4 mt-5"
                ref={videoRef}
                style={{
                    width: 400,
                }}
                ></video>
               
                {!videoRef && <h2>Loading...</h2>}
                </Row>
                <Row className="p-0 m-0">
                    {video ? 
                   <img src={video} alt="video" width="400" >
                   </img>
                   : <h3 className="m-5">Waiting for connection...</h3>
                   }
                </Row>
            </Col>
            <Col>
            <Row className="mt-4">
                <Button
                variant="danger" size="lg" type="submit" block
                className="mt-1 mb-4"
                onClick={() => {
                    window.location.href = '/'
                }}
            >
                Exit Room
            </Button>
            <video autoPlay className="d-none" ref={audioRef}></video>
            </Row>
                <div className="text-center">
                    <Button
                    variant="danger" size="lg" type="submit" 
                    className="mb-2"
                    onClick={() => {
                        setShowCanvas(!showCanvas)
                    }}
                    >
                    Swap Notes/Host Canvas
                    </Button>
                </div>
                {! showCanvas && <Col>
                <Form className="text-center">
                    <Form.Group controlId="notes">
                        <Form.Label>My Notes: </Form.Label>
                        <Form.Control 
                        as="textarea" rows={14} 
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        />
                        
                    </Form.Group>
                    </Form>
                
            <div className="text-center">
            <Button
                variant="success" size="lg" type="submit"
                className="mb-0"
                onClick={() => {
                    downloadTxtFile()
                }}
                >
                Save Notes as .txt
                </Button>
            </div> 
            </Col> }
                <Col> 
                { canvas && <img src={canvas} alt="canvas" width="500" >
            </img> } 

                </Col>
            </Col>
            
            </Row>

           
        </Container>
    )
}

