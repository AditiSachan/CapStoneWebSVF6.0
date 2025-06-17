import { Outlet } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
}

export default App;
