import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import { API } from '../config';

const Home = ({ categories }) => {
    const [popular, setPopular] = useState([]);

    useEffect(() => {
        loadPopular();
    }, []);

    const loadPopular = async () => {
        const { data } = await axios.get(`${API}/link/popular`);
        setPopular(data);
    };

    const handleClick = async linkId => {
        const response = await axios.put(`${API}/click-count`, { linkId });
        loadPopular();
    };

    const listOfLinks = () =>
        popular.map((link) => (
            <div key={link._id} className="row alert alert-secondary p-2">
                <div className="col-md-8" onClick={() => handleClick(link._id)}>
                    <a href={link.url} target="_blank">
                        <h5 className="pt-2">{link.title}</h5>
                        <h6 className="pt-2 text-danger" style={{ fontSize: '12px' }}>
                            {link.url}
                        </h6>
                    </a>
                </div>

                <div className="col-md-4 pt-2">
                    <span className="pull-right">
                        {moment(link.createdAt).fromNow()} by {link.postedBy.name}
                    </span>
                </div>

                <div className="col-md-12">
                    <span className="badge text-dark">
                        {link.type} {link.medium}
                    </span>
                    {link.categories.map((c, i) => (
                        <span key={link._id} className="badge text-success">
                            {c.name}
                        </span>
                    ))}
                    <span className="badge text-secondary pull-right">{link.clicks} clicks</span>
                </div>
            </div>
        ));

    const listCategories = () =>
        categories.map((c, i) => (
            <Link key={i} href={`/links/${c.slug}`}>
                <a style={{ border: '1px solid red' }} className="bg-light p-3 col-md-4">
                    <div>
                        <div className="row">
                            <div className="col-md-4">
                                <img
                                    src={c.image && c.image.url}
                                    alt={c.name}
                                    style={{ width: '100px', height: 'auto' }}
                                    className="pr-3"
                                />
                            </div>
                            <div className="col-md-8">
                                <h3>{c.name}</h3>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        ));

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1 className="font-weight-bold">Browse Tutorials/Courses</h1>
                    <br />
                </div>
            </div>

            <div className="row">{listCategories()}</div>

            <div className="row pt-5">
                <h2 className="font-weight-bold pb-3">Trending {popular.length}</h2>
                {<div className="col-md-12 overflow-hidden">{listOfLinks()}</div>}
            </div>
        </Layout>
    );
};

Home.getInitialProps = async () => {
    const response = await axios.get(`${API}/categories`);
    return {
        categories: response.data
    };
};

export default Home;
