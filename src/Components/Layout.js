import Breeds from './Breeds';
import Header from './Header';
import BreedInformation from './BreedInformation';
import ErroComponent from './Error';
import { Routes, Route } from 'react-router-dom'

function Layout(props){
    return (
        <div className="layout-container">
            <Header />
            <Routes>
                <Route path='/breed/:breedName' element={<BreedInformation />} />
                <Route path='/' element={<Breeds />} />
                <Route path='*' element={<ErroComponent status="404" message="Page Not Found" />}/>
            </Routes>
        </div>
    );
}

export default Layout;