import React from 'react';
import styles from './Jam.module.scss';
import { IoClose } from 'react-icons/io5';
import { useJam } from '../../../contexts/JamContext';

const Participant = ({ participant }) => {
  const { isHost, removeParticipant } = useJam();

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.participant}>
      <div className={styles.participant__avatar}>
        {participant.avatar ? (
          <img src={participant.avatar} alt={`${participant.name}'s avatar`} />
        ) : (
          <div className={styles.participant__avatar__placeholder}>
            {getInitial(participant.name)}
          </div>
        )}
        <span
          className={`${styles.participant__status} ${styles[`participant__status--${participant.status}`]}`}
        />
      </div>

      <div className={styles.participant__info}>
        <span className={styles.participant__info__name}>
          {participant.name}
          {participant.isHost && (
            <span className={styles.participant__info__host}>Host</span>
          )}
        </span>
        <span className={styles.participant__info__joined}>
          Joined {new Date(participant.joinedAt).toLocaleTimeString()}
        </span>
      </div>

      {isHost && !participant.isHost && (
        <button
          className={styles.participant__remove}
          onClick={() => removeParticipant(participant.id)}
          aria-label={`Remove ${participant.name} from session`}
        >
          <IoClose />
        </button>
      )}
    </div>
  );
};

export default Participant;
