import React from 'react';

function MyProfile() {
    return (
        <div className="settings-card" style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            border: '1px solid #E2E8F0' 
        }}>
            <h2 style={{ marginBottom: '24px', color: '#334155', fontSize: '24px' }}>Personal Information</h2>
            
            {/* Profile Avatar Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: '#F1F5F9', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '32px'
                }}>
                    👤
                </div>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>John Doe</div>
                    <button style={{ 
                        padding: '8px 16px', 
                        background: '#4AAED4', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                        Upload Photo
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
                        First Name *
                    </label>
                    <input 
                        type="text" 
                        placeholder="Enter your first name"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
                        Last Name *
                    </label>
                    <input 
                        type="text" 
                        placeholder="Enter your last name"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
                        Email Address *
                    </label>
                    <input 
                        type="email" 
                        value="user@example.com"
                        disabled
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: '#F8FAFC',
                            color: '#64748B',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
                        Phone Number
                    </label>
                    <input 
                        type="text" 
                        placeholder="Enter your phone number"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
                    University *
                </label>
                <select style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    boxSizing: 'border-box'
                }}>
                    <option>Select your university</option>
                    <option>University of Texas</option>
                    <option>Texas Christian University</option>
                    <option>Southern Methodist University</option>
                </select>
            </div>

            <button style={{
                padding: '14px 24px',
                background: '#4AAED4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
            }}>
                Save Changes
            </button>
        </div>
    );
}

export default MyProfile;


