import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from './ErrorPage';

interface ErrorBoundaryProps {
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
        // Vous pouvez également enregistrer l'erreur dans un service de journalisation
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Vous pouvez personnaliser cette partie avec une page d'erreur
            //return <h1>Something went wrong. Please try again later.</h1>;
            return <ErrorPage/>;
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