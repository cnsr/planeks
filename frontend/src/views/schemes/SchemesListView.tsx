import React, {useState, useEffect} from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import './schemes.css';
import axios from 'axios';

interface Column {
    id: number,
    int_max: number,
    int_min: number,
    name: string,
    order: number,
    column_type: string
}
interface Schema {
    id: number,
    columns: Array<Column>,
    field_delimiter: string,
    last_modified: string,
    name: string,
    string_delimiter: string,
}

const SchemesListView: React.FC<{}> = () => {
    const [schemas, setSchemas] = useState<Array<Schema>>([]);

    useEffect(() => retrieveSchemes(), [])

    const retrieveSchemes = () => {
        axios.get('https://planeks.tk/api/scheme/', {headers: {
            'Authorization': `Token ${localStorage.getItem("schemaJWT")}`
        }}).then(response => {
            setSchemas(response.data);
        }).catch(err => {
            console.log('err', err)
        })
    }
    
    const handleDelete = (id: number) => {
        axios.delete(`https://planeks.tk/api/scheme/${id}`, {headers: {
            'Authorization': `Token ${localStorage.getItem("schemaJWT")}`
        }}).then(response => {
            retrieveSchemes();
        }).catch(err => {
            console.log('err', err)
        })
    }

    return <div>
        <div id='schemas-title-row'>
            <h3>Data schemas</h3>
            <Button variant='success' href='/schemes/add'>New schema</Button>
        </div>
        <Table id='schemas-table' bordered>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Modified</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                { schemas.map((schema, counter) => {
                    return <tr key={counter}>
                        <td>{counter + 1}</td>
                        <td>{schema.name}</td>
                        <td>{schema.last_modified}</td>
                        <td className='schema-actions'>
                            <a href={`/schemes/${schema.id}`}>Edit</a>
                            <a href={`/schemes/${schema.id}/datasets`}>View Datasets</a>
                            <span className='schema-del' onClick={() => handleDelete(schema.id)}>Delete</span>
                        </td>
                    </tr>
                })}
                
            </tbody>
        </Table>
    </div>
}

export default SchemesListView;