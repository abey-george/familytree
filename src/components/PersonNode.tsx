import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Person } from '../types/family';
import { User } from 'lucide-react';

interface PersonNodeProps {
  data: {
    person: Person;
    onPersonClick: (person: Person) => void;
  };
}

const PersonNode = memo(({ data }: PersonNodeProps) => {
  const { person, onPersonClick } = data;

  return (
    <div className="person-node">
      <Handle type="target" position={Position.Top} />
      
      <div
        onClick={() => onPersonClick(person)}
        className="node-card"
      >
        {/* Photo Section */}
        <div className="photo-section">
          {person.photo ? (
            <img
              src={person.photo}
              alt={person.name}
              className="photo"
            />
          ) : (
            <div className="photo-placeholder">
              <User />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h3 className="name">
            {person.name}
          </h3>
          {person.location && (
            <p className="location">
              {person.location}
            </p>
          )}
          <div className="generation-badge">
            <span>
              Generation {person.generation}
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

PersonNode.displayName = 'PersonNode';

export default PersonNode;
