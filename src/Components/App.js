import Layout from './Layout';
import { BrowserRouter } from 'react-router-dom';
import '../Sass/_app.scss';

function App() {
	return (
		<BrowserRouter>
			<div className="app">
				<Layout />
			</div>
		</BrowserRouter>
	);
}

export default App;