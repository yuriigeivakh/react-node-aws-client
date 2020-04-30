import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.bubble.css';

const Create = ({ user, token }) => {
    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        buttonText: 'Create',
        image: '',
    });
    const [imageUploadButtonName, setImageUploadButtonName] = useState('Upload image');
    const [content, setContent] = useState('');

    const { name, success, error, buttonText } = state;

    const handleContent = e => {
        setContent(e);
        setState({...state, success: '', error: ''});
    }

    const handleImage = e => {
        const image = e.target.files[0];
        setImageUploadButtonName(image.name);
        Resizer.imageFileResizer(
            image, 
            300,
            300,
            'JPEG',
            100,
            0,
            uri => {
                setState({...state, image: uri, success: '', error: ''});
            },
            'base64',
        ); 
    }

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { name, image } = state;
        setState({ ...state, buttonText: 'Creating' });
        try {
            const response = await axios.post(`${API}/category`, { name, content, image }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setImageUploadButtonName('Upload image');
            setState({
                ...state,
                name: '',
                content: '',
                buttonText: 'Created',
                success: `${response.data.name} is created`
            });
        } catch (error) {
            console.log('CATEGORY CREATE ERROR', error);
            setState({ ...state, name: '', buttonText: 'Create', error: error.response.data.error });
        }
    };

    const createCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" required />
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                {/* <textarea onChange={handleChange('content')} value={content} className="form-control" required /> */}
                <ReactQuill onChange={handleContent} value={content} className="form-control" placeholder="Write something..." required theme="bubble" />
            </div>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    {imageUploadButtonName}
                    <input
                        onChange={handleImage}
                        type="file"
                        accept="image/*"
                        className="form-control"
                        hidden
                    />
                </label>
            </div>
            <div>
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Create category</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {createCategoryForm()}
                </div>
            </div>
        </Layout>
    );
};

export default withAdmin(Create);
