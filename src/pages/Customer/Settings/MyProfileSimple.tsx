import React from 'react';

const MyProfileSimple: React.FC = () => {
    return (
        <div style={{ padding: '20px', border: '2px solid red', background: 'white' }}>
            <h2>Simple MyProfile Test</h2>
            <p>This is a test to see if the component renders at all.</p>
            
            <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    First Name:
                </label>
                <input 
                    type="text" 
                    placeholder="Enter First Name"
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />
            </div>
            
            <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Last Name:
                </label>
                <input 
                    type="text" 
                    placeholder="Enter Last Name"
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />
            </div>
            
            <div style={{ marginTop: '20px' }}>
                <button 
                    type="button"
                    style={{ 
                        padding: '10px 20px', 
                        background: '#007bff', 
                        color: 'white', 
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default MyProfileSimple;