import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from './ErrorPage';


interface ErrorBoundaryProps {
    fallback: (error: Error, errorInfo: ErrorInfo) => ReactNode;
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
        return this.props.fallback(new Error('Error caught by ErrorBoundary'), {});
        }

        return this.props.children;
    }
}

export default ErrorBoundary;



// interface ErrorBoundaryProps {
//         children: ReactNode;
//     }

    
// class ErrorBoundary extends React.Component <ErrorBoundaryProps>{
//     state = { hasError : true }
//     //@ts-ignore
//     static getDerivedStateFromError(error){
//         return { hasError : true};
//     }

//     componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
//         console.log(error, errorInfo);
//     }

//     render(){
//         if (this.state.hasError){
//             return <ErrorPage/>;
//         }
//         return this.props.children;
//     }
// }

// export default ErrorBoundary;