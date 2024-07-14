import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import GraphsPage from '../pages/graphs/graphsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <GraphsPage />,
      },
    ],
  },
]);