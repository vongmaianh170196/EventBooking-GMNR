import React from 'react'
import '../../css/Modal.css'
export const EnventModal = props => {
    return (
        <div className="modal">
            <header className="modal-header"><h1>{props.title}</h1></header>
            <section className="modal-content">{props.children}</section>
            <section className="modal-actions">
                {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
                {props.canConfirm && <button className="btn" onClick={props.onConfirm}>Confirm</button>}
            </section>
        </div>
    )
}
