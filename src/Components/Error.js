function ErroComponent(props){
    let {status, message} = props;
    
    return (
        <div className="error-container">
            <h1>{status}</h1>
            <h1>{message}</h1>
        </div>
    );
}

export default ErroComponent;