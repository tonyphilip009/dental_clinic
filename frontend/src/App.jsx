import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [services, setServices] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services/')
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>House of Dental</h1>

      <pre>
        {JSON.stringify(services, null, 2)}
      </pre>
    </div>
  )
}

export default App