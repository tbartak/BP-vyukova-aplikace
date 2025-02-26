import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Intersection Visualization App</h1>
      <Link to="/select-intersection">
        <button>Vyberte křižovatku</button>
      </Link>
    </div>
  )
}

export default Home