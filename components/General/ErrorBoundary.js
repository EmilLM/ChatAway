import DataError from '@/General/DataError'

// error boundaries do not catch errors on SSR so its for client-side code (useEffect etc)
class ErrorBoundary extends React.Component {
    constructor() {
      super()
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log('Error boundary', error)
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <DataError/>
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;