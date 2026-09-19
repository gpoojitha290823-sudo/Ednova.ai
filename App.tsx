import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Auth } from './pages/Auth'
import { Chat } from './pages/Chat'
import { Coding } from './pages/Coding'
import { Home } from './pages/Home'
import { Materials } from './pages/Materials'
import { Notes } from './pages/Notes'
import { Planner } from './pages/Planner'
import { Progress } from './pages/Progress'
import { Quiz } from './pages/Quiz'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/coding" element={<Coding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
