import React, {useState, useEffect, Fragment} from "react";
import { useHistory } from 'react-router-dom';
import './schemes.css';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/esm/Col";

type RowType = 'fullname'|'job'|'email'|'domain'|'phone'|'company'|'integer'|'address'|'date';
type RowKeyType = 'id'|'name'|'type'|'min'|'max'|'order';

const PossibeRowTypes: RowType[] = ['fullname','job','email','domain','phone','company','integer','address','date'];

interface Row {
    id: number|null|undefined,
    localid: number,
    name: string,
    column_type: RowType,
    int_min: number,
    int_max: number,
    order: number,
}

interface Column {
    id: number,
    int_max: number,
    int_min: number,
    name: string,
    order: number,
    column_type: string
}

const SchemesCreateReadView: React.FC<{match: any, location: any}> = (props): any => {
    const history = useHistory();
    const [schemaExists, setSchemaExists] = useState(false);
    const [editID, setEditID] = useState<null|number>(null);

    const [schemaName, setSN] = useState('');
    const [schemaSeparator, setSep] = useState('comma');
    const [schemaString, setStr] = useState('double');
    const [rows, setRows] = useState<Array<Row>>([]);

    const [rowName, setRN] = useState('');
    const [rowType, setRT] = useState<RowType>(PossibeRowTypes[0]);
    const [rowMin, setRMin] = useState(0);
    const [rowMax, setRMax] = useState(0);
    const [rowOrder, setROrder] = useState(0);
    
    useEffect(() => {
        if (props.match.params.id !== 'add') {
            setSchemaExists(true);
            axios.get(`https://planeks.tk/api/scheme/${props.match.params.id}/`,
                {headers: {
                    'Authorization': `Token ${localStorage.getItem("schemaJWT")}`
                }}
            ).then(response => {
                setSN(response.data.name);
                setSep(response.data.field_delimiter);
                setStr(response.data.string_delimiter);
                setEditID(response.data.id);
                let cols: Array<Row> = [];
                response.data.columns.map((col: Column, id: number) => {
                    cols.push({
                        localid: col.id ? col.id : id,
                        id: col.id,
                        name: col.name,
                        int_min: col.int_min,
                        int_max: col.int_max,
                        order: col.order,
                        column_type: col.column_type as RowType
                    })
                });
                setRows(cols)
                }
            )
        }
    }, [])

    const createSchema = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            name: schemaName,
            field_delimiter: schemaSeparator,
            string_delimiter: schemaString,
            columns: rows
        };
        if (!schemaExists) {
            axios.post('https://planeks.tk/api/scheme/add/', data, {headers: {
                'Authorization': `Token ${localStorage.getItem("schemaJWT")}`
            }}).then(response => {
                history.push('/')
            }).catch(err => {
                console.log('err', err)
            })
        } else {
            axios.put(`https://planeks.tk/api/scheme/${editID}/`, data, {headers: {
                'Authorization': `Token ${localStorage.getItem("schemaJWT")}`
            }}).then(response => {
                history.push('/')
            }).catch(err => {
                console.log('err', err)
            })
        }
    }

    const handleChangeRow = (localid: number, key: RowKeyType, value: string|null) => {
        rows.map((row: Row) => {
            if (row.localid === localid) {
                // this is bad
                switch (key as string) {
                    case 'name': row.name = value ? value : ""; break;
                    case 'type': row.column_type = value as RowType; break;
                    case 'min': row.int_min = parseInt(value !== null ? value : "0"); break;
                    case 'max': row.int_max = parseInt(value !== null ? value : "0"); break;
                    case 'order': row.order = parseInt(value !== null ? value : "0"); break;
                    default: break;
                }
            }
        })
        setRows([...rows]);
    }

    const addRow = () => {
        let newId = rows.length > 0 ? Math.max.apply(Math, rows.map(r => r.localid)) + 1 : 1;
        rows.push({
            id: -1, // is this even required
            localid: newId,
            name: rowName,
            column_type: rowType,
            int_min: rowMin,
            int_max: rowMax,
            order: rowOrder?rowOrder:rows.length,
        })
        setRows(rows)
        // reset values
        setRN('');
        setRT(PossibeRowTypes[0] as RowType);
        setRMin(0); setRMax(0); setROrder(rows.length)
        setRows([...rows]);
    }

    const removeRow = (id: number) => {
        rows.filter(row => row.localid !== id);
    }

    return (<div>
        <Form id='create-scheme-form'>
            <div id='schemas-title-row'>
                <h2>New schema</h2>
                <Button type='submit'
                    disabled={!schemaName || rows.length === 0}
                    onClick={createSchema}
                >Save</Button>
            </div>
            <Form.Group id='create-scheme-setup'>
                <Form.Row>
                    <Form.Label>Name</Form.Label>
                    <Form.Control as='input' type='text' value={schemaName} onChange={e => setSN(e.target.value)} />
                </Form.Row>
                <Form.Row>
                    <Form.Label>Column separator</Form.Label>
                    <Form.Control as='select' onChange={e => setSep(e.target.value)} value={schemaSeparator}>
                        <option value="comma">Comma (,)</option>
                        <option value="semicolon">Semicolon (;)</option>
                        <option value="colon">Colon (:)</option>
                        <option value="tab">Tab (tab)</option>
                        <option value="space">Space (space)</option>
                    </Form.Control>
                </Form.Row>
                <Form.Row>
                    <Form.Label>String character</Form.Label>
                    <Form.Control as='select' onChange={e => setStr(e.target.value)} value={schemaString}>
                        <option value="single">Single-quote(')</option>
                        <option value="double">Double-quote(")</option>
                    </Form.Control>
                </Form.Row>
            </Form.Group>
            <Form.Group id='form-table'>
                <h4>Schema columns</h4>
                <div id='form-table-rows'>
                    {rows.map((row, idx) => {
                        return <div key={idx} className='form-table-row'>
                            <Form.Row>
                                <Col sm='3'>
                                    <Form.Label>Column name</Form.Label>
                                    <Form.Control as='input' type='text' value={row.name} 
                                        onChange={e => handleChangeRow(row.localid, 'name', e.target.value)}/>
                                </Col>
                                <Col sm='2'>
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control as='select'
                                        onChange={e => handleChangeRow(row.localid, 'type', e.target.value)}
                                        value={row.column_type}
                                    >
                                        {PossibeRowTypes.map((prt, idprt) => {
                                            return <option value={prt} key={idprt}>{prt.charAt(0).toUpperCase() + prt.slice(1)}</option>
                                        })}
                                    </Form.Control>
                                </Col>
                                <Col sm='1'>
                                    {row.column_type === 'integer' ?
                                        <Fragment>
                                            <Form.Label>From</Form.Label>
                                            <Form.Control as='input' type='number' value={row.int_min}
                                                onChange={e => handleChangeRow(row.localid, 'min', e.target.value)}
                                            />
                                        </Fragment>
                                    : null}
                                </Col>
                                <Col sm='1'>
                                    {row.column_type === 'integer' ?
                                        <Fragment>
                                            <Form.Label>To</Form.Label>
                                            <Form.Control as='input' type='number' value={row.int_max}
                                                onChange={e => handleChangeRow(row.localid, 'max', e.target.value)}
                                            />
                                        </Fragment>
                                    : null}
                                </Col>
                                <Col sm='3'>
                                    <Form.Label>Order</Form.Label>
                                    <Form.Control as='input' type='number' min={0} value={row.order} max={rows.length}
                                        onChange={e => handleChangeRow(row.localid, 'order', e.target.value)}
                                    />
                                </Col>
                                <Col sm='1' className='remove-btn'>
                                    <Button variant="outline-danger" onClick={() => removeRow(row.localid)}>Delete</Button>
                                </Col>
                            </Form.Row>
                        </div>
                    })}
                </div>
            </Form.Group>
            <Form.Group id='row-add-new'>
                <Form.Row>
                    <Col sm='3'>
                        <Form.Label>Column name</Form.Label>
                        <Form.Control as='input' type='text' onChange={e => setRN(e.target.value)}/>
                    </Col>
                    <Col sm='2'>
                        <Form.Label>Type</Form.Label>
                        <Form.Control as='select' onChange={e => setRT(e.target.value as RowType)}>
                            {PossibeRowTypes.map((prt, idprt) => {
                                return <option value={prt} key={idprt}>{prt.charAt(0).toUpperCase() + prt.slice(1)}</option>
                            })}
                        </Form.Control>
                    </Col>
                    <Col sm='1'>
                        {rowType === 'integer' ?
                            <Fragment>
                                <Form.Label>From</Form.Label>
                                <Form.Control as='input' type='number' onChange={e => setRMin(parseInt(e.target.value))}/>
                            </Fragment>
                        : null}
                    </Col>
                    <Col sm='1'>
                        {rowType === 'integer' ?
                            <Fragment>
                                <Form.Label>To</Form.Label>
                                <Form.Control as='input' type='number' onChange={e => setRMax(parseInt(e.target.value))}/>
                            </Fragment>
                        : null}
                    </Col>
                    <Col sm='3'>
                        <Form.Label>Order</Form.Label>
                        <Form.Control as='input' type='number' min={0} max={rows.length} onChange={e => setROrder(parseInt(e.target.value))}/>
                    </Col>
                </Form.Row>
                <Form.Row id='add-row-btn'>
                    <Button
                        onClick={addRow}
                        disabled={!rowName}
                    >Add column</Button>
                </Form.Row>
            </Form.Group>
        </Form>
    </div>)
}

export default SchemesCreateReadView;