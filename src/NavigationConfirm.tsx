// NavigationConfirm.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hasUnsavedChanges } from './redux/User/Settings/settingsSlice';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';


const NavigationConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasUnsavedChangesRedux = useSelector((state: any) => state.SettingsReducer.hasUnsavedChanges);

    const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

    // Handle route changes
    useEffect(() => {
        if (hasUnsavedChangesRedux && location.pathname !== "/settings") {
            setShowNavigationConfirm(true);
            navigate("/settings")
            setPendingNavigation(location.pathname);
        }
    }, [location.pathname, hasUnsavedChangesRedux]);


    return (
        <>
            <Modal show={showNavigationConfirm} onHide={() => setShowNavigationConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Unsaved Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You have unsaved changes. Are you sure you want to leave this page?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowNavigationConfirm(false);
                    }}>
                        Stay on Page
                    </Button>
                    <Button variant="primary" onClick={() => {
                        setShowNavigationConfirm(false);

                    }}>
                        Leave Page
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

export default NavigationConfirm;