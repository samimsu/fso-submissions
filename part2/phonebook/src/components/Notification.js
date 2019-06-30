import React from 'react'

const Notification = ({ message, error }) => {
    if (message === null && error === null) {
        return null
    }
    if (error === null) {
        return (
            <div className="success">
                {message}
            </div>
        )
    }
    return (
        <div className="error">
            {error}
        </div>
    )
}

export default Notification