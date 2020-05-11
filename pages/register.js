import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { isAuth } from '../helpers/auth';

const Register = ({ categories }) => {
    const [state, setState] = useState({
        name: 'Ryan',
        email: 'ryan@gmail.com',
        password: 'rrrrrr',
        error: '',
        success: '',
        buttonText: 'Register',
        selectedCategories: [],
    });

    const { name, email, password, error, success, buttonText, selectedCategories } = state;

    useEffect(() => {
        isAuth() && Router.push('/');
    }, []);

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText: 'Register' });
    };

    const handleToggle = c => () => {
        const clickedCategory = selectedCategories.indexOf(c);
        const all = [...selectedCategories];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
        
        setState({ ...state, selectedCategories: all, success: '', error: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Registering' });
        try {
            const response = await axios.post(`${API}/register`, {
                name,
                email,
                password,
                categories: selectedCategories,
            });
            setState({
                ...state,
                name: '',
                email: '',
                password: '',
                buttonText: 'Submitted',
                success: response.data.message
            });
        } catch (error) {
            setState({ ...state, buttonText: 'Register', error: error.response.data.error });
        }
    };

    const showCategories = () => (
            categories &&
            categories.map((c, i) => (
                <li className="list-unstyled" key={c._id}>
                    <input type="checkbox" onChange={handleToggle(c._id)} className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        );

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    value={name}
                    onChange={handleChange('name')}
                    type="text"
                    className="form-control"
                    placeholder="Type your name"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    value={email}
                    onChange={handleChange('email')}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange('password')}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                    required
                />
            </div>
            <div className="form-group">
                <label className="text-muted ml-4">Category</label>
                <ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>{showCategories()}</ul>
            </div>
            <div className="form-group">
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Register</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {registerForm()}
            </div>
        </Layout>
    );
};

Register.getInitialProps = async () => {
    const response = await axios.get(`${API}/categories`);
    return { categories: response.data };
};

export default Register;
