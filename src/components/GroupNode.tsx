import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';
import type { Person } from '../types/family';

interface GroupNodeProps {
  data: {
    people: Person[];
    onPersonClick: (person: Person) => void;
  };
}

const GroupNode = memo(({ data }: GroupNodeProps) => {
  const { people, onPersonClick } = data;

  return (
    <div className="group-node">
      <div className="group-node-content">
        {people.map((person, index) => (
          <div key={person.id} className="group-node-person" style={{ marginLeft: index > 0 ? '18px' : '0' }}>
            <div className="person-node-wrapper">
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
            </div>
          </div>
        ))}
      </div>
      {/* Single handle at the bottom center for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#0D7377',
          width: '12px',
          height: '12px',
          border: '2px solid #14FFEC',
        }}
      />
    </div>
  );
});

GroupNode.displayName = 'GroupNode';

export default GroupNode;
