import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge'

import './dataset.css';

interface DSInterface {
    created_at: string,
    is_completed: boolean,
    file: string|null
}

const DataSet: React.FC<{match: any, location: any}> = (props) => {
    const schemeID = props.match.params.id;
    const [datasets, setDatasets] = useState<Array<DSInterface>>([]);
    const [rowCount, setRowCount] = useState(0);

    useEffect(() => {
        loadDatasets();
    }, [])

    const loadDatasets = () => {
        axios.get(`https://planeks.tk/api/scheme/${props.match.params.id}/datasets`,
            {headers: {
                'Authorization': `Token ${localStorage.getItem("schemaJWT")}`
            }}
        ).then(response => {
            setDatasets(response.data);
        })
    }

    const createDataset = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post(`https://planeks.tk/api/scheme/${props.match.params.id}/datasets/add/`,
            {
                rows: rowCount,
            },
            {headers: {
                'Authorization': `Token ${localStorage.getItem("schemaJWT")}`
            }}
        ).then(response => {
            loadDatasets();
        }).catch(err => console.log(err))
    }

    return <div id='datasets-view'>
        <div id='datasets-info-row'>
            <h5>Data Sets</h5>
            <div>
                <Form onSubmit={createDataset} id='rows-form'>
                    <Form.Label>Rows:</Form.Label>
                    <Form.Control
                        as='input' type='number'
                        min={1} max={1000} step={1}
                        value={rowCount}
                        onChange={e => setRowCount(parseInt(e.target.value))}
                    />
                    <Button type='submit' variant='success'>Create</Button>
                </Form>
            </div>
        </div>
        <Table bordered>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
               {datasets.map((dataset, count) => {
                   return <tr key={count}>
                       <td>{count+1}</td>
                       <td>{dataset.created_at}</td>
                       <td>{dataset.is_completed ?
                            <Badge variant='success'>Completed</Badge> :
                            <Badge variant='dark'>Processing</Badge>}
                       </td>
                       <td>
                            {dataset.is_completed ?
                                <a href={`${dataset.file}`} target="_blank">
                                    Download
                                </a>
                            : null}
                       </td>
                   </tr>
               })}
            </tbody>
        </Table>
    </div>
}

export default DataSet;