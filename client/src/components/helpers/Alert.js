import React,{useContext} from 'react'
import AlertContext from '../../context/alerts/alertContext'

const Alert = () => {
    const alertContext = useContext(AlertContext)
    return (
        alertContext.alerts.length > 0 && alertContext.alerts.map(
            alert => (
                <div key={alert.id}className={`alert alert-${alert.type} position-absolute w-50 slidein`}>
                    <i className='fas fa-info-circle'/> {alert.msg}
                </div>
            )
        )
    )
}

export default Alert
