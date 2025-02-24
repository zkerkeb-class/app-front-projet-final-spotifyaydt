import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Jam.module.scss';
import { FaSearch, FaSort, FaCrown } from 'react-icons/fa';
import { IoFilterSharp } from 'react-icons/io5';
import Participant from './Participant';

const ParticipantList = ({ participants, currentUserId }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('joinedAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [groupByStatus, setGroupByStatus] = useState(true);

  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [participants, searchQuery]);

  const sortedParticipants = useMemo(() => {
    return [...filteredParticipants].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'joinedAt':
          comparison = new Date(a.joinedAt) - new Date(b.joinedAt);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredParticipants, sortBy, sortOrder]);

  const groupedParticipants = useMemo(() => {
    if (!groupByStatus) return { all: sortedParticipants };

    return sortedParticipants.reduce((groups, participant) => {
      const status = participant.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(participant);
      return groups;
    }, {});
  }, [sortedParticipants, groupByStatus]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getInitial = (name) => {
    return name?.charAt(0).toUpperCase() || '?';
  };

  return (
    <div className={styles.participantList}>
      <div className={styles.participantList__controls}>
        <div className={styles.participantList__controls__search}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.participantList__controls__options}>
          <button
            className={styles.participantList__controls__sort}
            onClick={() => toggleSort('name')}
            title="Sort by name"
          >
            <FaSort />
            Name
          </button>
          <button
            className={styles.participantList__controls__sort}
            onClick={() => toggleSort('joinedAt')}
            title="Sort by join time"
          >
            <FaSort />
            Joined
          </button>
          <button
            className={`${styles.participantList__controls__group} ${groupByStatus ? styles.active : ''}`}
            onClick={() => setGroupByStatus(!groupByStatus)}
            title="Group by status"
          >
            <IoFilterSharp />
          </button>
        </div>
      </div>

      <div className={styles.participantList__content}>
        {groupByStatus
          ? Object.entries(groupedParticipants).map(
              ([status, participants]) => (
                <div key={status} className={styles.participantList__group}>
                  <h4 className={styles.participantList__group__title}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <span className={styles.participantList__group__count}>
                      ({participants.length})
                    </span>
                  </h4>
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`${styles.participant_item} ${
                        participant.id === currentUserId ? styles.current : ''
                      }`}
                    >
                      <div className={styles.participant_avatar}>
                        {getInitial(participant.name)}
                      </div>
                      <div className={styles.participant_info}>
                        <span className={styles.participant_name}>
                          {participant.name}
                          {participant.id === currentUserId && (
                            <span className={styles.you_badge}>
                              {t('jamSession.you')}
                            </span>
                          )}
                        </span>
                        {participant.isHost && (
                          <span className={styles.host_indicator}>
                            <FaCrown />
                            {t('jamSession.host')}
                          </span>
                        )}
                      </div>
                      <div className={styles.participant_status}>
                        <span
                          className={`${styles.status_dot} ${styles[participant.status]}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            )
          : sortedParticipants.map((participant) => (
              <div
                key={participant.id}
                className={`${styles.participant_item} ${
                  participant.id === currentUserId ? styles.current : ''
                }`}
              >
                <div className={styles.participant_avatar}>
                  {getInitial(participant.name)}
                </div>
                <div className={styles.participant_info}>
                  <span className={styles.participant_name}>
                    {participant.name}
                    {participant.id === currentUserId && (
                      <span className={styles.you_badge}>
                        {t('jamSession.you')}
                      </span>
                    )}
                  </span>
                  {participant.isHost && (
                    <span className={styles.host_indicator}>
                      <FaCrown />
                      {t('jamSession.host')}
                    </span>
                  )}
                </div>
                <div className={styles.participant_status}>
                  <span
                    className={`${styles.status_dot} ${styles[participant.status]}`}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ParticipantList;
