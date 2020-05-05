import React, { Fragment, useState } from 'react'
import { EnventModal } from './Modal/EnventModal';
import '../css/Events.css'
import { Backdrop } from './Modal/Backdrop';

export const Events = () => {
    const [creating, setCreating] = useState(false)
    const onConfirmModal = () => {
        setCreating(false)
    }
    return <Fragment>
        {creating && <Fragment>
            <Backdrop/>
            <EnventModal title="Add an event" canCancel canConfirm onConfirm={onConfirmModal} onCancel={() => setCreating(false)}>
                <p>Modal Content</p>
            </EnventModal>
        </Fragment>}
        <div className="events-control">
           <button className="btn" onClick={() => setCreating(true)}>Create an event</button>
        </div>
    </Fragment>
}
