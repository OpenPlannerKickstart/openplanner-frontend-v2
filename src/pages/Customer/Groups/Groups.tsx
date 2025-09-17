import React, { useState } from 'react';
import AddEditSyllabus from '../../../common/AddSyllabusEvents/AddEditSyllabus';
import AddEditGroup from '../../../common/Groups/AddEditGroup';
import { get, post } from '../../../Utility/httpInterceptor';
import { ts, te } from '../../../Utility/Toaster';
import GroupListItem from '../../..//components/Groups/GroupListItem';

const Groups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Add/Edit Syllabus state
  const [showSyllabus, setShowSyllabus] = useState(false);
  const handleSyllabusShow = () => setShowSyllabus(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showGroupInfo, setShowGroupInfo] = useState<boolean>(false);

  const fetchMyGroups = async () => {
    try {
      const res: any = await get('groups/mine');
      if (res?.data) {
        setMyGroups(res.data);
      }
    } catch (err: any) {
      te('Failed to load your groups');
    }
  };
  React.useEffect(() => {
    fetchMyGroups();
  }, []);

  const selectedGroup = selectedGroupId ? myGroups.find(g => g.id === selectedGroupId) : null;

  const handleLeaveGroup = async () => {
    if (!selectedGroupId) return;
    try {
      await post('groups/leave', { groupId: selectedGroupId });
      ts('Left group');
      setShowGroupInfo(false);
      setSelectedGroupId(null);
      await fetchMyGroups();
    } catch (err) {
      te('Failed to leave group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroupId) return;
    try {
      await post(`groups/${selectedGroupId}/delete`, {});
      ts('Group deleted');
      setShowGroupInfo(false);
      setSelectedGroupId(null);
      await fetchMyGroups();
    } catch (err) {
      te('Failed to delete group');
    }
  };

  return (
    <div className="page-content groups-page">
      <div className="page-title-wrapper" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="page-title-left">
          <div className="page-title">
            <h4>Groups</h4>
          </div>
        </div>
        <div className="page-title-right">
          <button type="button" className="btn btn-primary" onClick={() => setShowCreateGroup(true)}>
            Create Group
          </button>
          <button type="button" className="btn btn-warning" onClick={handleSyllabusShow}>
            Add Syllabus
          </button>
        </div>
      </div>
      <div className="content-area content-area-title-filter" style={{ overflow: 'hidden' }}>
        <div className="page-content-wrapper h-100" style={{ overflow: 'hidden' }}>
          <div className="row gx-0 gy-0" style={{ minHeight: 0 }}>
            <div className="col-12 col-lg-4 px-0" >
              <div className="d-flex flex-column h-100 bg-white" style={{ overflow: 'hidden' }}>
                {/* Search */}
                <div className="d-flex align-items-center search-row" style={{ height: 64, padding: '10px 8px', boxSizing: 'border-box', borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
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
                <div className="nav-tabs-outer nav-tabs-style2 px-0 tabs-row" style={{ background: '#fff', paddingBottom: 0 }}>
                  <nav>
                    <div
                      className="nav nav-tabs page-filters"
                      role="tablist"
                      style={{ position: 'relative', marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0, marginBottom: 0 }}
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
                      {/* Active underline indicator aligned to divider (overlaps by 1px) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: activeTab === 'chats' ? 0 : '50%',
                          bottom: -1,
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

                {/* List area wrapper (mirror right column pattern) */}
                <div className="left-scroll-inner d-flex flex-column" style={{ minHeight: 0 }}>
                  <div className="flex-grow-1 overflow-auto left-list-scroll" style={{ minHeight: 0 }}>
                  {activeTab === 'chats' ? (
                    <div className="text-center p-4">
                      <img src={'/assets/images/not-voucher-found.svg'} alt="Empty" style={{ width: 120, height: 'auto', opacity: 0.9 }} />
                      <h5 className="mt-3 mb-1">No recent chats</h5>
                      <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                        Start a conversation from a group or create a private study group.
                      </p>
                    </div>
                  ) : null}
                  {/* Temporary placeholder rows to verify left list scrolling */}
                  {activeTab === 'chats' ? (
                    <div className="px-3" aria-hidden="true">
                      {[...Array(40)].map((_, i) => (
                        <div key={`chatrow-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                          <div style={{ width: 36, height: 36, background: '#E5E7EB', borderRadius: '50%' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ height: 10, background: '#E5E7EB', borderRadius: 6, width: i % 3 === 0 ? '60%' : '40%' }} />
                            <div style={{ height: 10, background: '#F0F2F5', borderRadius: 6, width: i % 4 === 0 ? '30%' : '20%', marginTop: 6 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="px-3 pt-3">
                        <h6 className="mb-2" style={{ color: '#111827', fontWeight: 600, letterSpacing: 0.2 }}>My Groups</h6>
                      </div>
                      <div>
                        {myGroups && myGroups.length > 0 ? (
                          myGroups.map((g: any) => (
                            <GroupListItem
                              key={g.id}
                              id={g.id}
                              name={g.name}
                              avatarColor={g.avatarColor}
                              variant="mine"
                              isSelected={selectedGroupId === g.id}
                              onClick={() => setSelectedGroupId(g.id)}
                            />
                          ))
                        ) : (
                          <div className="text-center p-4">
                            <h5 className="mt-3 mb-1">You’re not in any groups yet</h5>
                            <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                              When you join or create a group, it will appear here.
                            </p>
                          </div>
                        )}
                      </div>
                      <hr className="my-0" />
                      <div className="px-3 pt-3">
                        <h6 className="mb-2" style={{ color: '#111827', fontWeight: 600, letterSpacing: 0.2 }}>Find groups to join</h6>
                      </div>
                      <div className="text-center p-4">
                        <h5 className="mt-3 mb-1">No suggestions available</h5>
                        <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                          Upload a syllabus to get tailored group suggestions.
                        </p>
                      </div>
                      {/* Temporary placeholder rows for Groups tab as well */}
                      <div className="px-3" aria-hidden="true">
                        {[...Array(40)].map((_, i) => (
                          <div key={`grouprow-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                            <div style={{ width: 36, height: 36, background: '#E5E7EB', borderRadius: '50%' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ height: 10, background: '#E5E7EB', borderRadius: 6, width: i % 3 === 0 ? '55%' : '45%' }} />
                              <div style={{ height: 10, background: '#F0F2F5', borderRadius: 6, width: i % 4 === 0 ? '35%' : '25%', marginTop: 6 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
            {/* Right column (chat area) */}
            <div className="col-12 col-lg-8 d-flex flex-column" style={{ minHeight: 0, overflow: 'auto', overflowX: 'hidden', position: 'relative' }}>
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between" style={{ height: 64, padding: '10px 24px', boxSizing: 'border-box', borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                <div className="d-flex align-items-center gap-2">
                  {selectedGroupId ? (
                    <>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 44, height: 44, borderRadius: 22, background: (myGroups.find(g => g.id === selectedGroupId)?.avatarColor) || '#E5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={'/assets/images/book.svg'} alt="avatar" style={{ width: 26, height: 'auto' }} />
                        </div>
                        <h5 className="mb-0" style={{ color: '#111827' }}>{myGroups.find(g => g.id === selectedGroupId)?.name}</h5>
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={'/assets/images/avatar-default.svg'} alt="avatar" style={{ width: 44, height: 44, borderRadius: '50%' }} />
                      <h5 className="mb-0" style={{ color: '#6B7280' }}>{activeTab === 'groups' ? 'Select a group' : 'Select a conversation'}</h5>
                    </>
                  )}
                </div>
                {(activeTab === 'groups' || !!selectedGroupId) ? (
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-primary"
                      style={{ height: 40, minWidth: 120, borderRadius: 8, opacity: selectedGroupId ? 1 : 0.6 }}
                      disabled={!selectedGroupId}
                      onClick={() => setShowGroupInfo(true)}
                    >
                      Group Info
                    </button>
                    <button className="btn btn-outline-white" style={{ height: 40, width: 56, borderRadius: 8 }}>
                      <i className="material-symbols-outlined">search</i>
                    </button>
                  </div>
                ) : null}
              </div>
              {/* Chat timeline (independent scroll) */}
              <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                <div className="flex-grow-1" style={{ background: '#FAFAFA', padding: '16px 24px' }}>
                  {[...Array(25)].map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ width: 32, height: 32, background: '#E5E7EB', borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 10, background: '#E5E7EB', borderRadius: 6, width: i % 3 === 0 ? '60%' : '40%' }} />
                        <div style={{ height: 10, background: '#F0F2F5', borderRadius: 6, width: i % 4 === 0 ? '30%' : '20%', marginTop: 6 }} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Composer */}
                <div className="d-flex align-items-center" style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', background: '#fff', position: 'sticky', bottom: 0, zIndex: 1 }}> 
                  <div className="input-group">
                    <input className="form-control" placeholder="Send a message" style={{ outline: 'none', boxShadow: 'none' }} />
                    <button className="btn btn-outline-white" type="button" aria-label="Attach file" title="Attach">
                      <i className="material-symbols-outlined">attach_file</i>
                    </button>
                    <button className="btn btn-primary" type="button">Send</button>
                  </div>
                </div>
              </div>

              {/* Nested Group Info panel (animated slide) */}
              {/* Backdrop limited to right column content area */}
              <div
                onClick={() => setShowGroupInfo(false)}
                style={{
                  position: 'absolute', left: 0, right: 0, top: 64, bottom: 0,
                  background: 'rgba(0,0,0,0.06)', zIndex: 2,
                  opacity: showGroupInfo ? 1 : 0,
                  transition: 'opacity 220ms ease',
                  pointerEvents: showGroupInfo ? 'auto' : 'none'
                }}
              />
              <div
                style={{
                  position: 'absolute', top: 64, right: 0, bottom: 0, width: 380,
                  background: '#fff', borderLeft: '1px solid #E5E7EB', boxShadow: '0 0 24px rgba(0,0,0,0.08)', zIndex: 3,
                  display: 'flex', flexDirection: 'column',
                  transform: showGroupInfo ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 240ms ease',
                  pointerEvents: showGroupInfo ? 'auto' : 'none'
                }}
              >
                {/* Banner header: fills with avatar color, icon left, close on right */}
                <div
                  style={{
                    background: (selectedGroup?.avatarColor) || '#E5F3FF',
                    height: 96,
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <img src={'/assets/images/book.svg'} alt="group" style={{ width: 32, height: 'auto' }} />
                  <button className="btn btn-outline-white" onClick={() => setShowGroupInfo(false)}>
                    <i className="material-symbols-outlined">close</i>
                  </button>
                </div>
                {/* Name under banner */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                  <h5 className="mb-1" style={{ color: '#111827' }}>{selectedGroup?.name || 'Group'}</h5>
                  <div className="text-muted" style={{ fontSize: 14 }}>
                    {(() => {
                      const typeLabel = selectedGroup?.type === 'canonical' ? 'Class' : 'Group';
                      const count = typeof selectedGroup?.memberCount === 'number' ? selectedGroup?.memberCount : null;
                      const countLabel = count !== null ? `${count} Student${count === 1 ? '' : 's'}` : 'Students';
                      return `${typeLabel} - ${countLabel}`;
                    })()}
                  </div>
                </div>
                {/* Description card with 10% avatar tint */}
                <div style={{ padding: '16px' }}>
                  {(() => {
                    const hex = selectedGroup?.avatarColor || '#E5F3FF';
                    const toRGBA = (h: string, alpha: number) => {
                      const m = h.replace('#','');
                      const r = parseInt(m.substring(0,2), 16);
                      const g = parseInt(m.substring(2,4), 16);
                      const b = parseInt(m.substring(4,6), 16);
                      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    };
                    const bg = toRGBA(hex, 0.10);
                    const border = toRGBA(hex, 0.25);
                    const description = selectedGroup?.description || 'No description provided.';
                    const creatorName = (selectedGroup?.createdBy && (selectedGroup?.createdBy.displayName || selectedGroup?.createdBy.name))
                      || (selectedGroup?.owner && (selectedGroup?.owner.displayName || selectedGroup?.owner.name))
                      || selectedGroup?.creatorName
                      || 'Unknown';
                    const createdAtRaw = selectedGroup?.createdAt || selectedGroup?.created_on || selectedGroup?.created_at || null;
                    const createdAtStr = createdAtRaw ? new Date(createdAtRaw).toLocaleDateString() : '';
                    return (
                      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 16 }}>
                        <div style={{ color: '#111827', lineHeight: 1.6 }}>{description}</div>
                        <div className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
                          Created By : {creatorName}{createdAtStr ? `  ${createdAtStr}` : ''}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Actions: Only show when this is one of myGroups (i.e., joined) */}
                {selectedGroup ? (
                  <>
                    <div style={{ borderTop: '1px solid #E5E7EB' }} />
                    <div style={{ padding: '16px' }}>
                      <div className="d-flex flex-column gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-white text-start"
                        onClick={handleLeaveGroup}
                        style={{
                          border: '1px solid #E5E7EB',
                          borderRadius: 12,
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          width: '100%'
                        }}
                      >
                        <i className="material-symbols-outlined">logout</i>
                        <span>Exit Group</span>
                      </button>

                      {selectedGroup?.type !== 'canonical' ? (
                        <button
                          type="button"
                          className="btn btn-outline-white text-start"
                          onClick={handleDeleteGroup}
                          style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: 12,
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            width: '100%'
                          }}
                        >
                          <i className="material-symbols-outlined">delete</i>
                          <span>Delete Group</span>
                        </button>
                      ) : null}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Syllabus Modal */}
      <AddEditSyllabus 
        showSyllabus={showSyllabus} 
        setShowSyllabus={setShowSyllabus} 
        handleGetData={() => {}} // TODO: Add syllabus data refresh if needed
      />
      {/* Create Group Modal */}
      <AddEditGroup 
        showGroup={showCreateGroup}
        setShowGroup={setShowCreateGroup}
        handleGetData={() => {}}
        onCreate={async (payload) => {
          try {
            const res: any = await post('groups/create', payload);
            if (res?.data) {
              ts('Group created');
              await fetchMyGroups();
            }
          } catch (err: any) {
            te('Failed to create group');
          }
        }}
      />
    </div>
  );
};

export default Groups;
