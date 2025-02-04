import React, { useState, useMemo } from 'react';
import styles from './Jam.module.scss';
import { FaSearch, FaSort } from 'react-icons/fa';
import { IoFilterSharp } from 'react-icons/io5';
import Participant from './Participant';

const ParticipantList = ({ participants }) => {
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
                    <Participant
                      key={participant.id}
                      participant={participant}
                    />
                  ))}
                </div>
              )
            )
          : sortedParticipants.map((participant) => (
              <Participant key={participant.id} participant={participant} />
            ))}
      </div>
    </div>
  );
};

export default ParticipantList;
