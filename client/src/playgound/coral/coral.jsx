import React, { useState } from 'react';
import './style.scss';
import swagger from './swagger.json';
import axiosRequest from '../../services/axiosRequest'
// Mock axios request function


export default function CoralSwaggerAPITester() {
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState({});

    const axiosRequestHandler = async (method, path, body, params, index) => {
        const key = `${method}-${index}`;
        setLoading(prev => ({ ...prev, [key]: true }));
        
        try {
            let url = path;
            if (params && Object.keys(params).length > 0) {
                const queryString = new URLSearchParams(params).toString();
                url += `?${queryString}`;
            }
            
            const response = await axiosRequest({ method, url, body, params });
            setResponses(prev => ({ ...prev, [key]: response }));
        } catch (error) {
            setResponses(prev => ({ ...prev, [key]: { error: error.message } }));
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const GetRequestComponent = ({ path, params = [], index }) => {
        const [queryParams, setQueryParams] = useState({});

        const handleParamChange = (paramName, value) => {
            setQueryParams(prev => ({ ...prev, [paramName]: value }));
        };

        return (
            <div className="request-component get-request">
                <div className="method-badge get">GET</div>
                <div className="path">{path}</div>
                
                {params.length > 0 && (
                    <div className="params-section">
                        <h4>Query Parameters:</h4>
                        {params.map((param, idx) => (
                            <div key={idx} className="param-input">
                                <label>{param.name}:</label>
                                <input
                                    type="text"
                                    placeholder={`Enter ${param.name}`}
                                    onChange={(e) => handleParamChange(param.name, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}
                
                <button 
                    className="send-button"
                    onClick={() => axiosRequestHandler('GET', path, null, queryParams, index)}
                    disabled={loading[`GET-${index}`]}
                >
                    {loading[`GET-${index}`] ? 'Loading...' : 'Send Request'}
                </button>
            </div>
        );
    };

    const PostRequestComponent = ({ path, body: bodySchema, index }) => {
        const [body, setBody] = useState(bodySchema ? JSON.stringify(bodySchema, null, 2) : '');

        return (
            <div className="request-component post-request">
                <div className="method-badge post">POST</div>
                <div className="path">{path}</div>
                
                <div className="body-section">
                    <h4>Request Body:</h4>
                    <textarea
                        placeholder="Enter JSON request body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                    />
                </div>
                
                <button 
                    className="send-button"
                    onClick={() => {
                        try {
                            const parsedBody = body ? JSON.parse(body) : null;
                            axiosRequestHandler('POST', path, parsedBody, null, index);
                        } catch (error) {
                            alert('Invalid JSON in request body');
                        }
                    }}
                    disabled={loading[`POST-${index}`]}
                >
                    {loading[`POST-${index}`] ? 'Loading...' : 'Send Request'}
                </button>
            </div>
        );
    };

    const PutRequestComponent = ({ path, body: bodySchema, index }) => {
        const [body, setBody] = useState(bodySchema ? JSON.stringify(bodySchema, null, 2) : '');

        return (
            <div className="request-component put-request">
                <div className="method-badge put">PUT</div>
                <div className="path">{path}</div>
                
                <div className="body-section">
                    <h4>Request Body:</h4>
                    <textarea
                        placeholder="Enter JSON request body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                    />
                </div>
                
                <button 
                    className="send-button"
                    onClick={() => {
                        try {
                            const parsedBody = body ? JSON.parse(body) : null;
                            axiosRequestHandler('PUT', path, parsedBody, null, index);
                        } catch (error) {
                            alert('Invalid JSON in request body');
                        }
                    }}
                    disabled={loading[`PUT-${index}`]}
                >
                    {loading[`PUT-${index}`] ? 'Loading...' : 'Send Request'}
                </button>
            </div>
        );
    };

    const DeleteRequestComponent = ({ path, index }) => {
        return (
            <div className="request-component delete-request">
                <div className="method-badge delete">DELETE</div>
                <div className="path">{path}</div>
                
                <button 
                    className="send-button"
                    onClick={() => axiosRequestHandler('DELETE', path, null, null, index)}
                    disabled={loading[`DELETE-${index}`]}
                >
                    {loading[`DELETE-${index}`] ? 'Loading...' : 'Send Request'}
                </button>
            </div>
        );
    };

    const ResponseComponent = ({ response }) => {
        if (!response) return null;

        return (
            <div className="response-section">
                <h4>Response:</h4>
                <pre className={response.error ? 'error' : 'success'}>
                    {JSON.stringify(response, null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <div className="swagger-api-tester">
            <h1>API Testing Interface</h1>
            <div className="endpoints-container">
                {swagger.map((item, index) => {
                    const responseKey = `${item.method}-${index}`;
                    
                    return (
                        <div key={index} className="endpoint-card">
                            {(() => {
                                switch (item.method) {
                                    case 'GET':
                                        return <GetRequestComponent 
                                            path={item.path} 
                                            params={item.params} 
                                            index={index}
                                        />;
                                    case 'POST':
                                        return <PostRequestComponent 
                                            path={item.path} 
                                            body={item.body} 
                                            index={index}
                                        />;
                                    case 'PUT':
                                        return <PutRequestComponent 
                                            path={item.path} 
                                            body={item.body} 
                                            index={index}
                                        />;
                                    case 'DELETE':
                                        return <DeleteRequestComponent 
                                            path={item.path} 
                                            index={index}
                                        />;
                                    default:
                                        return null;
                                }
                            })()}
                            
                            <ResponseComponent response={responses[responseKey]} />
                        </div>
                    );
                })}
            </div>


        </div>
    );
}