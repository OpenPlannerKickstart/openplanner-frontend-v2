import React, { useState } from 'react';

const Groups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');

  const EmptyListState = (props: { title: string; subtitle: string }) => {
    return (
      <div className="text-center p-4">
        <img src={'/assets/images/not-voucher-found.svg'} alt="Empty" style={{ width: 120, height: 'auto', opacity: 0.9 }} />
        <h5 className="mt-3 mb-1">{props.title}</h5>
        <p className="text-muted mb-0" style={{ fontSize: 14 }}>{props.subtitle}</p>
      </div>
    );
  };

  const EmptyChatPane = () => {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <div className="text-center p-4">
          <img src={'/assets/images/not-voucher-found.svg'} alt="No conversation" style={{ width: 160, height: 'auto', opacity: 0.9 }} />
          <h4 className="mt-3">No conversation selected</h4>
          <p className="text-muted mb-0" style={{ maxWidth: 420, margin: '0 auto' }}>
            Choose a chat or group from the left to get started, or create a new private study group.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="page-content">
      <div className="page-title-wrapper" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="page-title-left">
          <div className="page-title">
            <h4>Groups</h4>
          </div>
        </div>
        <div className="page-title-right"></div>
      </div>

      <div className="content-area content-area-title-filter" style={{ position: 'relative' }}>
        {/* Global separators */}
        {/* Horizontal separator spanning both columns under the top sections */}
        <div className="d-none d-lg-block" style={{ position: 'absolute', left: 0, right: 0, top: 64, height: 1, background: '#E5E7EB', zIndex: 0, pointerEvents: 'none' }} />
        {/* Full-height vertical separator between left and chat sections */}
        <div className="d-none d-lg-block" style={{ position: 'absolute', top: 0, bottom: 0, left: 'calc(33.3333% + 20px)', width: 1, background: '#E5E7EB', zIndex: 0, pointerEvents: 'none' }} />
        <div className="page-content-wrapper h-100" style={{ height: 'calc(100vh - 188px)' }}>
          <div className="row gx-0 gy-3 h-100">
            {/* LEFT SIDE */}
            <div className="col-12 col-lg-4 h-100">
              <div className="h-100 d-flex flex-column bg-white" style={{ height: '100%' }}>
                {/* Top section: fixed height to match chat-side top bar */}
                <div className="d-flex align-items-center" style={{ height: 64, marginLeft: -20, paddingLeft: 0, width: 'calc(100% + 30px)', position: 'relative', zIndex: 1 }}>
                  <div className="px-2 w-100" style={{ position: 'relative', height: 44, transform: 'translateY(-20px)' }}>
                    <i
                      className="material-symbols-outlined"
                      style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: 20, pointerEvents: 'none' }}
                    >
                      search
                    </i>
                    <input
                      type="text"
                      className="form-control w-100"
                      placeholder="Search"
                      aria-label="Search chats or groups"
                      style={{ height: 44, borderRadius: 10, paddingLeft: 44, border: '2px solid #E5E7EB' }}
                    />
                  </div>
                </div>

                {/* Tabs section */}
                <div className="nav-tabs-outer nav-tabs-style2 px-3 pt-2">
                  <nav>
                    <div className="nav nav-underline" role="tablist" style={{ gap: 12 }}>
                      <button
                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'chats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chats')}
                      >
                        <i className="material-symbols-outlined">chat_bubble</i>
                        <span>All Chats</span>
                      </button>
                      <button
                        className={`nav-link d-flex align-items-center gap-2 ${activeTab === 'groups' ? 'active' : ''}`}
                        onClick={() => setActiveTab('groups')}
                      >
                        <i className="material-symbols-outlined">groups</i>
                        <span>Groups</span>
                      </button>
                    </div>
                  </nav>
                </div>

                {/* Chat info section (list area) */}
                <div className="flex-grow-1 overflow-auto">
                  {activeTab === 'chats' ? (
                    <EmptyListState
                      title="No recent chats"
                      subtitle="Start a conversation from a group or create a private study group."
                    />
                  ) : (
                    <div>
                      <div className="px-3 pt-3">
                        <h5 className="mb-2">My Groups</h5>
                      </div>
                      <EmptyListState
                        title="You’re not in any groups yet"
                        subtitle="When you join or create a group, it will appear here."
                      />
                      <hr className="my-0" />
                      <div className="px-3 pt-3">
                        <h5 className="mb-2">Find groups to join</h5>
                      </div>
                      <EmptyListState
                        title="No suggestions yet"
                        subtitle="Upload a syllabus to get tailored group suggestions."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CHAT SIDE */}
            <div className="col-12 col-lg-8 h-100">
              {/* Chat side top section: same height as search top */}
              <div className="d-none d-lg-flex align-items-center justify-content-between" style={{ height: 64, paddingLeft: 24, paddingRight: 24, position: 'relative', zIndex: 1, transform: 'translateY(-20px)' }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle" style={{ width: 32, height: 32, background: '#E5E7EB' }} />
                  <h5 className="mb-0" style={{ color: '#6B7280' }}>{activeTab === 'groups' ? 'Select a group' : 'Select a conversation'}</h5>
                </div>
                {activeTab === 'groups' ? (
                  <div className="d-flex align-items-center gap-2" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    <button className="btn btn-outline-white" style={{ height: 40, minWidth: 120, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Group Info</button>
                    <button className="btn btn-outline-white" style={{ height: 40, width: 56, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
                      <i className="material-symbols-outlined">search</i>
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Chat section */}
              <div className="h-100 d-flex flex-column ps-lg-4" style={{ height: 'calc(100% - 64px)' }}>
                <EmptyChatPane />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
