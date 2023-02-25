import React from 'react'
import { useState, useMemo } from "react";
import axios from "axios";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../css/segment.css';

export default function Segments() {
  const [segmentName, setSegmentName] = useState('');
  const [selectedSQ, setSelectedSQ] = useState();
  const [schema, setSchema] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const tempsechemas = [
    { "label": "First Name", "value": "first_name" },
    { "label": "Last Name", "value": "last_name" },
    { "label": "Age", "value": "age" },
    { "label": "Account Name", "value": "account_name" },
    { "label": "City", "value": "city" },
    { "label": "State", "value": "state" },
  ]

  const onChange = (segmentname) => {
    setSegmentName(segmentname)
  }

  const addDropdown = () => {
    if (!selectedSQ)
      return ;
    const tempSelected = tempsechemas.find((item) => item.value === selectedSQ);
    setSchema((state) => {
      return [...state, tempSelected]
    })
    setSelectedSQ("");
  }

  const selectedSechema = e => {
    setSelectedSQ(e.target.value)
  };

  const changeSechema = (e, index) => {
    const value = tempsechemas.find(item2 => item2.value === e.target.value);
    setSchema(state => {
      let temp = [...state]
      temp[index] = value
      return temp
    })
  }

  const filteredSQ = useMemo(() => {
    let temp = [];
    if (schema.length > 0) {
      temp = tempsechemas.filter(item => {
        const isPresent = schema.find(item2 => item2.value === item.value);
        return isPresent ? false : true;
      });
    } else {
      temp = [...tempsechemas];
    }
    return temp;
  }, [schema]);

  const saveSchema = async () => {
    const segmentObj = {}
    let scheme = [];

    schema.forEach(element => {
      const temp = {};
      temp[element.value] = element.label;
      scheme.push(temp);
    });
    console.log(segmentName.length,scheme.length,"hi")

    if(scheme.length == 0) return
    if(segmentName.length == 0) return 

    segmentObj["segment_name"] = segmentName
    segmentObj["schema"] = scheme

    await axios.post(`https://webhook.site/02fbfdfe-8191-4409-a05d-983a093e4d72`, {
      segmentObj
    }).then(resp => {
      console.log(resp)
      handleClose();
    }).catch(function (error) {
        console.log(error);
    });
  }

  return (
    <div>
      <br></br><br></br>
      <Button variant="primary" onClick={handleShow}>
        Save segment
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Saving Segment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter the name of the segment</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name of the segment"
                onChange={(event) => onChange(event.target.value)}
                value={segmentName}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              {schema.length > 0 &&
                schema.map((SQ, index) => (
                  <div key={index}>
                    <select className="select" value={SQ.value} onChange={(e) => changeSechema(e, index)}>
                      <option value={SQ.value}>{SQ.label}</option>
                      {filteredSQ.map((filtSQ, index) => {
                        return (
                          <option
                            key={index}
                            value={filtSQ.value}>
                            {filtSQ.label}
                          </option>
                        )
                      })}
                    </select>
                    <br></br><br></br>
                  </div>
                ))
              }
          </Form.Group>
          <Form.Group>
            {<select value={selectedSQ} onChange={selectedSechema} className="select">
              <option value="">Add schema to segment</option>
              {filteredSQ.map((schema, index) => {
                return (
                  <option
                    key={index}
                    value={schema.value}>
                    {schema.label}
                  </option>
                )
              })}
            </select>}
            <br></br><br></br>
            <Button onClick={addDropdown}>Add schema</Button>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={saveSchema}>
            Save Changes
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}