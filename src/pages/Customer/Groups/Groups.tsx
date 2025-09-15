import React, { useState } from 'react';

const Groups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="page-content groups-page">
      <div className="page-title-wrapper" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="page-title-left">
          <div className="page-title">
            <h4>Groups</h4>
          </div>
        </div>
        <div className="page-title-right"></div>
      </div>
      <div className="content-area content-area-title-filter">
        <div className="page-content-wrapper h-100">
          <div className="row gx-0 gy-0">
            <div className="col-12 col-lg-4 px-0" >
              <div className="d-flex flex-column h-100 bg-white" style={{ overflow: 'auto' }}>
                {/* Search */}
                <div className="d-flex align-items-center" style={{ height: 64, borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
                  <div className="px-2 w-100" style={{ position: 'relative' }}>
                    <i
                      className="material-symbols-outlined"
                      style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }}
                    >
                      search
                    </i>
                    <input
                      className="form-control w-100"
                      placeholder="Search"
                      aria-label="Search"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      style={{
                        height: 44,
                        paddingLeft: 44,
                        borderRadius: 10,
                        border: searchFocused ? '1px solid #0EA5E9' : '1px solid #E5E7EB',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Tabs - site styling with single baseline and aligned indicator */}
                <div className="nav-tabs-outer nav-tabs-style2 px-0" style={{ position: 'sticky', top: 64, background: '#fff', zIndex: 1 }}>
                  <nav>
                    <div
                      className="nav nav-tabs page-filters"
                      role="tablist"
                      style={{ position: 'relative', marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}
                    >
                      <div className="page-filters-left w-100 d-flex justify-content-around">
                        <button
                          type="button"
                          className={`nav-link ${activeTab === 'chats' ? 'active' : ''}`}
                          onClick={() => setActiveTab('chats')}
                          style={{ borderBottom: 'none', paddingTop: 8, paddingBottom: 8 }}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <i className="material-symbols-outlined" style={{ fontSize: 40 }}>chat_bubble</i>
                            <span style={{ fontSize: 12 }}>All Chats</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          className={`nav-link ${activeTab === 'groups' ? 'active' : ''}`}
                          onClick={() => setActiveTab('groups')}
                          style={{ borderBottom: 'none', paddingTop: 8, paddingBottom: 8 }}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <i className="material-symbols-outlined" style={{ fontSize: 40 }}>menu_book</i>
                            <span style={{ fontSize: 12 }}>Groups</span>
                          </div>
                        </button>
                      </div>
                      {/* Active underline indicator aligned to baseline and spanning half width */}
                      <div
                        style={{
                          position: 'absolute',
                          left: activeTab === 'chats' ? 0 : '50%',
                          bottom: 0,
                          width: '50%',
                          height: 3,
                          background: '#0EA5E9',
                          borderRadius: 0,
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </nav>
                </div>

                {/* List area (scrollable) */}
                <div className="flex-grow-1" style={{ minHeight: 0 }}>
                  {activeTab === 'chats' ? (
                    <div className="text-center p-4">
                      <img src={'/assets/images/not-voucher-found.svg'} alt="Empty" style={{ width: 120, height: 'auto', opacity: 0.9 }} />
                      <h5 className="mt-3 mb-1">No recent chats</h5>
                      <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                        Start a conversation from a group or create a private study group.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="px-3 pt-3">
                        <h6 className="mb-2" style={{ color: '#6B7280', fontWeight: 600, letterSpacing: 0.2 }}>My Groups</h6>
                      </div>
                      <div className="text-center p-4">
                        <img src={'/assets/images/not-voucher-found.svg'} alt="Empty" style={{ width: 120, height: 'auto', opacity: 0.9 }} />
                        <h5 className="mt-3 mb-1">You’re not in any groups yet</h5>
                        <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                          When you join or create a group, it will appear here.
                        </p>
                      </div>
                      <hr className="my-0" />
                      <div className="px-3 pt-3">
                        <h6 className="mb-2" style={{ color: '#6B7280', fontWeight: 600, letterSpacing: 0.2 }}>Find groups to join</h6>
                      </div>
                      <div className="text-center p-4">
                        <img src={'/assets/images/not-voucher-found.svg'} alt="Empty" style={{ width: 120, height: 'auto', opacity: 0.9 }} />
                        <h5 className="mt-3 mb-1">No suggestions available</h5>
                        <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                          Upload a syllabus to get tailored group suggestions.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
