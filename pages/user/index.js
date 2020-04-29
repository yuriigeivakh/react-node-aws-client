const axios = require('axios');
import Layout from '../../components/Layout';
import withUser from '../withUser';

const User = ({todos}) => <Layout>User {JSON.stringify(todos[0])}</Layout>;

User.getInitialProps = async () => {
    const { data } = await axios('https://jsonplaceholder.typicode.com/todos');
    return {
        todos: data,
    }
}

export default withUser(User);
