import * as React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{display: "flex", flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <h1>Something Went Wrong</h1>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;