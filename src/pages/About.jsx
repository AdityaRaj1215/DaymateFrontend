import Card from '../components/Card'

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-cursor-text mb-8 text-center">
            About Daymate
          </h1>
          
          <Card>
            <h2 className="text-2xl font-semibold text-cursor-text mb-4">
              Project Information
            </h2>
            <p className="text-cursor-text-muted mb-4">
              Daymate is a modern frontend application built with React, JavaScript, 
              and Tailwind CSS. This project provides a solid foundation for building 
              scalable web applications.
            </p>
            <p className="text-cursor-text-muted mb-4">
              The project structure includes reusable components, custom hooks, 
              utility functions, and a clean organization that makes it easy to 
              maintain and extend.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default About


