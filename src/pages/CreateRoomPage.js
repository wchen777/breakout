import { useEffect, useRef, useState} from 'react';
import { message } from 'antd';
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import CanvasDraw from "react-canvas-draw";

export default function CreateRoomPage() {
  const [video, setVideo] = useState(null);
  const [notes, setNotes] = useState('');
  const [peerId, setPeerId] = useState('');

  const [showCanvas, setShowCanvas] = useState(false);

  const videoRef = useRef({});
  const audioRef = useRef(null);
  const canvRef = useRef({});


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });

    import('peerjs').then((module) => {
      const Peer = module.default;
      const peer = new Peer({
        host: 'polar-escarpment-94286.herokuapp.com',
        port: process.env.NODE_ENV === 'development' ? 80 : 443,
      });
      peer.on('open', (id) => {
        setPeerId(id);
        let conn = null;
        peer.on('connection', (_conn) => {
          console.log('connected');
          conn = _conn;
          conn.on('data', (data) => {
            console.log('received data');
            // var stream = data.captureStream(25);
            // recVidRef.current.srcObject = stream;
            //setNotes(data.notes)
            setVideo(data.image);
            // recVidRef.current = data;
          });
        });

        navigator.mediaDevices
          .getUserMedia({
            audio: true,
          })
          .then((stream) => {
            peer.on('call', (call) => {
              console.log('received call');
              call.answer(stream);
              call.on('stream', (stream) => {
                console.log('received stream');
                audioRef.current.srcObject = stream;
              });
            });
          });
        
        
        
        // send video screen
        const canvas = document.createElement('canvas');
        canvas.width = 225;
        canvas.height = 168.75;
        const ctx = canvas.getContext('2d')
        setInterval(() => {
          if (conn) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            //conn.send(videoRef.current)

            // send video data
            const image = canvas.toDataURL()

            // send canvas data
            const canvDraw = canvRef.current && canvRef.current.canvasContainer ? 
                canvRef.current.canvasContainer.childNodes[1].toDataURL() :
                null
            conn.send({image: image, canvas: canvDraw})
            }
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
                {!peerId && <h3 className="m-5">Loading...</h3>}
                </Row>
                <Row>
                    {video ? 
                   
                    <img src={video} alt="video" width="416">
                    </img>
                    : <h3 className="m-5">Waiting for connection...</h3>
                    }
                </Row>
            </Col>
            <Col>
            <Row className="mt-1">
                <h3 className="text-center"> <b>Room Key: </b> <br/> 
                <span 
                role="button"
                onClick={() => {
                navigator.clipboard.writeText(peerId).then(() => {
                  message.open({
                    icon: <></>,
                    content: 'Copied!',
                    duration: 3,
                    type: 'info',
                    style: { fontSize: '1.5rem', position: 'absolute', top: '8px', right: '16px'},
                  });
                });
              }} 
              title="Click to copy"> {peerId}</span></h3>
                <Button
                variant="danger" size="lg" type="submit" block
                className="mb-4"
                onClick={() => {
                    window.location.href = '/'
                }}
                >
                Exit Room
                </Button>
                <video autoPlay className="d-none m-0 p-0" ref={audioRef}></video>
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
                    onChange={e => setNotes(e.target.value)}/>
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
            </Col>}
            {showCanvas && 
                <Col>
                <div className="text-center">
                <CanvasDraw
                ref={canvRef}
                immediateLoading={false} 
                hideInterface={false} 
                lazyRadius={0}
                brushRadius={2}
                hideGrid={false}
                canvasHeight={430}
                canvasWidth={500}
                > </CanvasDraw>
                <Button
                    variant="success" size="lg" type="submit"
                    className="mr-2"
                    onClick={() => {
                        canvRef.current.clear()
                    }}
                    >
                    Clear
                </Button>

                <Button
                    variant="success" size="lg" type="submit"
                    className="ml-1"
                    onClick={() => {
                        canvRef.current.undo()
                    }}
                    >
                    Undo
                </Button>
                </div>
                </Col> 
                } 
            
            
            </Col>
            </Row>

           
        </Container>
    )
}