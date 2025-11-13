import Card from '../components/Card'
import Button from '../components/Button'

const Home = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-cursor-text mb-8 text-center">
            Welcome to Daymate
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card title="Getting Started" subtitle="Start building your application">
              <p className="text-cursor-text-muted mb-4">
                This is a modern React application with Tailwind CSS. 
                Start by exploring the components and pages folders.
              </p>
              <Button variant="primary">Get Started</Button>
            </Card>

            <Card title="Components" subtitle="Reusable UI components">
              <p className="text-cursor-text-muted mb-4">
                Check out the pre-built components like Button, Card, Input, 
                and LoadingSpinner in the components folder.
              </p>
              <Button variant="outline">View Components</Button>
            </Card>
          </div>

          <Card title="Features" className="mb-8">
            <ul className="space-y-2 text-cursor-text-muted">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                React 18 with Hooks
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Tailwind CSS for styling
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Vite for fast development
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom hooks and utilities
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Home


